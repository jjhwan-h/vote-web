import type { RegisterCredentialDefinitionReturnStateFinished } from '@credo-ts/anoncreds'
import type { ConnectionRecord, ConnectionStateChangedEvent, InitConfig } from '@credo-ts/core'
import type { IndyVdrRegisterSchemaOptions, IndyVdrRegisterCredentialDefinitionOptions } from '@credo-ts/indy-vdr'
import {agentDependencies} from '@credo-ts/node'
import { ConnectionEventTypes, KeyType, TypedArrayEncoder, utils,Agent } from '@credo-ts/core'

import { BaseAgent, indyNetworkConfig } from './BaseAgent'
import { Color, Output, greenText, purpleText, redText } from './OutputClass'
import { singleton,inject} from 'tsyringe'

export enum RegistryOptions {
  indy = 'did:indy',
  cheqd = 'did:cheqd',
}

@singleton()
class Faber extends BaseAgent {
  public outOfBandId?: string
  public credentialDefinition?: RegisterCredentialDefinitionReturnStateFinished
 
  public constructor(@inject("port")port: number, @inject("name")name: string) {
    super(port, name)
    this.initializeAgent();
    console.log("Faber Construct")
  }

  public static async build(): Promise<Faber> {
    const faber = new Faber(Number(process.env.PORT), process.env.NAME!)
    await faber.initializeAgent()
    return faber
  }


  private async getConnectionRecord() {
    if (!this.outOfBandId) {
      throw Error(redText(Output.MissingConnectionRecord))
    }

    const [connection] = await this.agent.connections.findAllByOutOfBandId(this.outOfBandId)

    if (!connection) {
      throw Error(redText(Output.MissingConnectionRecord))
    }

    return connection
  }

  private async printConnectionInvite() {
    const outOfBand = await this.agent.oob.createInvitation()
    this.outOfBandId = outOfBand.id

    console.log(
      Output.ConnectionLink,
      outOfBand.outOfBandInvitation.toUrl({ domain: `http://localhost:${this.port}` }),
      '\n'
    )
  }

  private async waitForConnection() {
    if (!this.outOfBandId) {
      throw new Error(redText(Output.MissingConnectionRecord))
    }

    console.log('Waiting for Alice to finish connection...')

    const getConnectionRecord = (outOfBandId: string) =>
      new Promise<ConnectionRecord>((resolve, reject) => {
        // Timeout of 20 seconds
        const timeoutId = setTimeout(() => reject(new Error(redText(Output.MissingConnectionRecord))), 20000)

        // Start listener
        this.agent.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, (e) => {
          if (e.payload.connectionRecord.outOfBandId !== outOfBandId) return

          clearTimeout(timeoutId)
          resolve(e.payload.connectionRecord)
        })

        // Also retrieve the connection record by invitation if the event has already fired
        void this.agent.connections.findAllByOutOfBandId(outOfBandId).then(([connectionRecord]) => {
          if (connectionRecord) {
            clearTimeout(timeoutId)
            resolve(connectionRecord)
          }
        })
      })

    const connectionRecord = await getConnectionRecord(this.outOfBandId)

    try {
      await this.agent.connections.returnWhenIsConnected(connectionRecord.id)
    } catch (e) {
      console.log(redText(`\nTimeout of 20 seconds reached.. Returning to home screen.\n`))
      return
    }
    console.log(greenText(Output.ConnectionEstablished))
  }

  public async setupConnection() {
    await this.printConnectionInvite()
    await this.waitForConnection()
  }

  private printSchema(name: string, version: string, attributes: string[]) {
    console.log(`\n\nThe credential definition will look like this:\n`)
    console.log(purpleText(`Name: ${Color.Reset}${name}`))
    console.log(purpleText(`Version: ${Color.Reset}${version}`))
    console.log(purpleText(`Attributes: ${Color.Reset}${attributes[0]}, ${attributes[1]}, ${attributes[2]}\n`))
  }

  private async registerSchema() {
    if (!this.anonCredsIssuerId) {
      throw new Error(redText('Missing anoncreds issuerId'))
    }
    const schemaTemplate = {
      name: 'Faber College' + utils.uuid(),
      version: '1.0.0',
      attrNames: ['name', 'degree', 'date'],
      issuerId: this.anonCredsIssuerId,
    }
    this.printSchema(schemaTemplate.name, schemaTemplate.version, schemaTemplate.attrNames)


    const { schemaState } = await this.agent.modules.anoncreds.registerSchema<IndyVdrRegisterSchemaOptions>({
      schema: schemaTemplate,
      options: {
        endorserMode: 'internal',
        endorserDid: this.anonCredsIssuerId,
      },
    })

    if (schemaState.state !== 'finished') {
      throw new Error(
        `Error registering schema: ${schemaState.state === 'failed' ? schemaState.reason : 'Not Finished'}`
      )
    }

    return schemaState
  }

  private async registerCredentialDefinition(schemaId: string) {
    if (!this.anonCredsIssuerId) {
      throw new Error(redText('Missing anoncreds issuerId'))
    }

    const { credentialDefinitionState } =
      await this.agent.modules.anoncreds.registerCredentialDefinition<IndyVdrRegisterCredentialDefinitionOptions>({
        credentialDefinition: {
          schemaId,
          issuerId: this.anonCredsIssuerId,
          tag: 'latest',
        },
        options: {
          supportRevocation: false,
          endorserMode: 'internal',
          endorserDid: this.anonCredsIssuerId,
        },
      })

    if (credentialDefinitionState.state !== 'finished') {
      throw new Error(
        `Error registering credential definition: ${
          credentialDefinitionState.state === 'failed' ? credentialDefinitionState.reason : 'Not Finished'
        }}`
      )
    }

    this.credentialDefinition = credentialDefinitionState
    return this.credentialDefinition
  }

  public async issueCredential() {
    const schema = await this.registerSchema()
    const credentialDefinition = await this.registerCredentialDefinition(schema.schemaId)
    const connectionRecord = await this.getConnectionRecord()


    await this.agent.credentials.offerCredential({
      connectionId: connectionRecord.id,
      protocolVersion: 'v2',
      credentialFormats: {
        anoncreds: {
          attributes: [
            {
              name: 'name',
              value: 'Alice Smith',
            },
            {
              name: 'degree',
              value: 'Computer Science',
            },
            {
              name: 'date',
              value: '01/01/2022',
            },
          ],
          credentialDefinitionId: credentialDefinition.credentialDefinitionId,
        },
      },
    })
  }


  private async newProofAttribute() {
    const proofAttribute = {
      name: {
        name: 'name',
        restrictions: [
          {
            cred_def_id: this.credentialDefinition?.credentialDefinitionId,
          },
        ],
      },
    }

    return proofAttribute
  }

  public async sendProofRequest() {
    const connectionRecord = await this.getConnectionRecord()
    const proofAttribute = await this.newProofAttribute()

    await this.agent.proofs.requestProof({
      protocolVersion: 'v2',
      connectionId: connectionRecord.id,
      proofFormats: {
        anoncreds: {
          name: 'proof-request',
          version: '1.0',
          requested_attributes: proofAttribute,
        },
      },
    })
  }

  public async sendMessage(message: string) {
    const connectionRecord = await this.getConnectionRecord()
    await this.agent.basicMessages.sendMessage(connectionRecord.id, message)
  }

  public async exit() {
    console.log(Output.Exit)
    await this.agent.shutdown()
    process.exit(0)
  }

  public async restart() {
    await this.agent.shutdown()
  }
}


export {Faber}