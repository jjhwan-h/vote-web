import type { AgentDependencies, DidCreateResult, DidRecord, InitConfig, Wallet, WalletConfig } from '@aries-framework/core'
import type { IndyVdrPoolConfig } from '@aries-framework/indy-vdr'

import {
  AnonCredsCredentialFormatService,
  AnonCredsHolderServiceSymbol,
  AnonCredsIssuerServiceSymbol,
  AnonCredsModule,
  AnonCredsProofFormatService,
  LegacyIndyCredentialFormatService,
  LegacyIndyProofFormatService,
  V1CredentialProtocol,
  V1ProofProtocol,
} from '@aries-framework/anoncreds'
import { AskarModule } from '@aries-framework/askar'
import {
  CheqdAnonCredsRegistry,
  CheqdDidRegistrar,
  CheqdDidResolver,
  CheqdModule,
  CheqdModuleConfig,
} from '@aries-framework/cheqd'
import {
  ConnectionsModule,
  DidsModule,
  V2ProofProtocol,
  V2CredentialProtocol,
  ProofsModule,
  AutoAcceptProof,
  AutoAcceptCredential,
  CredentialsModule,
  Agent,
  HttpOutboundTransport,
  KeyType,
} from '@aries-framework/core'
import { IndyVdrIndyDidResolver, IndyVdrAnonCredsRegistry, IndyVdrModule,IndyVdrDidCreateOptions,IndyVdrDidCreateResult,IndyVdrIndyDidRegistrar } from '@aries-framework/indy-vdr'
import { agentDependencies, HttpInboundTransport } from '@aries-framework/node'
import { anoncreds } from '@hyperledger/anoncreds-nodejs'
import { AnonCredsRsModule } from '@aries-framework/anoncreds-rs'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { indyVdr } from '@hyperledger/indy-vdr-nodejs'
import { greenText } from './OutputClass'
import "reflect-metadata"
import { container, injectable } from 'tsyringe'
import dotenv from 'dotenv';

dotenv.config();
export interface IAskarAnonCredsIndyModules{
  connections: ConnectionsModule,
  anoncreds: AnonCredsModule,
  indyVdr: IndyVdrModule,
  cheqd: CheqdModule,
  dids: DidsModule,
  askar: AskarModule
}
const bcovrin = `{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node1","blskey":"4N8aUNHSgjQVgkpm8nhNEfDf6txHznoYREg9kirmJrkivgL4oSEimFF6nsQ6M41QvhM2Z33nves5vfSn9n1UwNFJBYtWVnHYMATn76vLuL3zU88KyeAYcHfsih3He6UHcXDxcaecHVz6jhCYz1P2UZn2bDVruL5wXpehgBfBaLKm3Ba","blskey_pop":"RahHYiCvoNCtPTrVtP7nMC5eTYrsUA8WjXbdhNc8debh1agE9bGiJxWBXYNFbnJXoXhWFMvyqhqhRoq737YQemH5ik9oL7R4NTTCz2LEZhkgLJzB3QRQqJyBNyv7acbdHrAT8nQ9UkLbaVL9NBpnWXBTw4LEMePaSHEw66RzPNdAX1","client_ip":"138.197.138.255","client_port":9702,"node_ip":"138.197.138.255","node_port":9701,"services":["VALIDATOR"]},"dest":"Gw6pDLhcBcoQesN72qfotTgFa7cbuqZpkX3Xo6pLhPhv"},"metadata":{"from":"Th7MpTaRZVRYnPiabds81Y"},"type":"0"},"txnMetadata":{"seqNo":1,"txnId":"fea82e10e894419fe2bea7d96296a6d46f50f93f9eeda954ec461b2ed2950b62"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node2","blskey":"37rAPpXVoxzKhz7d9gkUe52XuXryuLXoM6P6LbWDB7LSbG62Lsb33sfG7zqS8TK1MXwuCHj1FKNzVpsnafmqLG1vXN88rt38mNFs9TENzm4QHdBzsvCuoBnPH7rpYYDo9DZNJePaDvRvqJKByCabubJz3XXKbEeshzpz4Ma5QYpJqjk","blskey_pop":"Qr658mWZ2YC8JXGXwMDQTzuZCWF7NK9EwxphGmcBvCh6ybUuLxbG65nsX4JvD4SPNtkJ2w9ug1yLTj6fgmuDg41TgECXjLCij3RMsV8CwewBVgVN67wsA45DFWvqvLtu4rjNnE9JbdFTc1Z4WCPA3Xan44K1HoHAq9EVeaRYs8zoF5","client_ip":"138.197.138.255","client_port":9704,"node_ip":"138.197.138.255","node_port":9703,"services":["VALIDATOR"]},"dest":"8ECVSk179mjsjKRLWiQtssMLgp6EPhWXtaYyStWPSGAb"},"metadata":{"from":"EbP4aYNeTHL6q385GuVpRV"},"type":"0"},"txnMetadata":{"seqNo":2,"txnId":"1ac8aece2a18ced660fef8694b61aac3af08ba875ce3026a160acbc3a3af35fc"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node3","blskey":"3WFpdbg7C5cnLYZwFZevJqhubkFALBfCBBok15GdrKMUhUjGsk3jV6QKj6MZgEubF7oqCafxNdkm7eswgA4sdKTRc82tLGzZBd6vNqU8dupzup6uYUf32KTHTPQbuUM8Yk4QFXjEf2Usu2TJcNkdgpyeUSX42u5LqdDDpNSWUK5deC5","blskey_pop":"QwDeb2CkNSx6r8QC8vGQK3GRv7Yndn84TGNijX8YXHPiagXajyfTjoR87rXUu4G4QLk2cF8NNyqWiYMus1623dELWwx57rLCFqGh7N4ZRbGDRP4fnVcaKg1BcUxQ866Ven4gw8y4N56S5HzxXNBZtLYmhGHvDtk6PFkFwCvxYrNYjh","client_ip":"138.197.138.255","client_port":9706,"node_ip":"138.197.138.255","node_port":9705,"services":["VALIDATOR"]},"dest":"DKVxG2fXXTU8yT5N7hGEbXB3dfdAnYv1JczDUHpmDxya"},"metadata":{"from":"4cU41vWW82ArfxJxHkzXPG"},"type":"0"},"txnMetadata":{"seqNo":3,"txnId":"7e9f355dffa78ed24668f0e0e369fd8c224076571c51e2ea8be5f26479edebe4"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node4","blskey":"2zN3bHM1m4rLz54MJHYSwvqzPchYp8jkHswveCLAEJVcX6Mm1wHQD1SkPYMzUDTZvWvhuE6VNAkK3KxVeEmsanSmvjVkReDeBEMxeDaayjcZjFGPydyey1qxBHmTvAnBKoPydvuTAqx5f7YNNRAdeLmUi99gERUU7TD8KfAa6MpQ9bw","blskey_pop":"RPLagxaR5xdimFzwmzYnz4ZhWtYQEj8iR5ZU53T2gitPCyCHQneUn2Huc4oeLd2B2HzkGnjAff4hWTJT6C7qHYB1Mv2wU5iHHGFWkhnTX9WsEAbunJCV2qcaXScKj4tTfvdDKfLiVuU2av6hbsMztirRze7LvYBkRHV3tGwyCptsrP","client_ip":"138.197.138.255","client_port":9708,"node_ip":"138.197.138.255","node_port":9707,"services":["VALIDATOR"]},"dest":"4PS3EDQ3dW1tci1Bp6543CfuuebjFrg36kLAUcskGfaA"},"metadata":{"from":"TWwCRQRZ2ZHMJFn9TzLp7W"},"type":"0"},"txnMetadata":{"seqNo":4,"txnId":"aa5e817d7cc626170eca175822029339a444eb0ee8f0bd20d3b0b76e566fb008"},"ver":"1"}`

export const indyNetworkConfig = {
  genesisTransactions: bcovrin,
  indyNamespace: 'bcovrin:test',
  isProduction: false,
  connectOnStartup: true,
} satisfies IndyVdrPoolConfig


type DemoAgent = Agent<ReturnType<typeof getAskarAnonCredsIndyModules>>

@injectable()
export class BaseAgent {
  public port: number
  public name: string
  public config: InitConfig
  public agent: DemoAgent
  public anonCredsIssuerId?: string

  public constructor(port: number,name: string) {
    this.name = name
    this.port = port
  
    const config = {
      label: name,
      walletConfig: { //지갑은 자동으로 생성됨
        id: name,
        key: name,
      },
      endpoints: [`http://localhost:${this.port}`],
      autoUpdateStorageOnStartup:true,
    } satisfies InitConfig
    this.config = config
    container.register(AnonCredsIssuerServiceSymbol,{useValue:AnonCredsIssuerServiceSymbol})
    container.register(AnonCredsHolderServiceSymbol,{useValue:AnonCredsHolderServiceSymbol})
    this.agent = new Agent({
      config,
     dependencies: agentDependencies,
     modules: getAskarAnonCredsIndyModules(),
    });
    this.agent.registerInboundTransport(new HttpInboundTransport({ port }))
    this.agent.registerOutboundTransport(new HttpOutboundTransport())
    console.log("BaseAgent Construct")
  }

  // public async createDid():Promise<string>{
  //   //console.log(this.agent.wallet) //지갑생성되어있는지 확인 (did는 wallet에 저장된다.)
  //   const key = await this.agent.wallet.createKey({keyType:KeyType.P256})
  //   console.log(key);
  //   const indyDocument :DidCreateResult = await this.agent.dids.create({
  //     method:"indy",
  //     options:{
  //       endorserDid:"did:indy:bcovrin:test:8ECVSk179mjsjKRLWiQtss",
  //       endorserMode:'external',
  //       }
  //     });
  //     const indyDid = String(indyDocument.didState.did);
  //     console.log("indyDid"+indyDid);
  //     return this.anonCredsIssuerId= indyDid;
  //   }

  public async createDid():Promise<string>{
    await this.agent.wallet.open(this.config.walletConfig as WalletConfig)
    const did = await this.agent.dids.create({
      method: 'cheqd',
      // the secret contains a the verification method type and id
      secret: {
        verificationMethod: {
          id: 'key-1',
          type: 'Ed25519VerificationKey2020',
        },
      },
      // an optional methodSpecificIdAlgo parameter
      options: {
        network: 'testnet',
        methodSpecificIdAlgo: 'uuid',
      },
    })
    console.log(did)
    return did.didState.did as string;
}

  public async importDid() {
    if (!this.anonCredsIssuerId) this.anonCredsIssuerId=await this.createDid();
    else return this.anonCredsIssuerId
  }

  public async initializeAgent() {
    await this.agent.initialize();
    console.log(greenText(`\nAgent ${this.name} created!\n`))
  }
}

function getAskarAnonCredsIndyModules(){
  const legacyIndyCredentialFormatService = new LegacyIndyCredentialFormatService()
    const legacyIndyProofFormatService = new LegacyIndyProofFormatService()
    return {
      connections: new ConnectionsModule({
        autoAcceptConnections: true,
      }),
      credentials: new CredentialsModule({
        autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
        credentialProtocols: [
          new V1CredentialProtocol({
            indyCredentialFormat: legacyIndyCredentialFormatService,
          }),
          new V2CredentialProtocol({
            credentialFormats: [legacyIndyCredentialFormatService, new AnonCredsCredentialFormatService()],
          }),
        ],
      }),
      proofs: new ProofsModule({
        autoAcceptProofs: AutoAcceptProof.ContentApproved,
        proofProtocols: [
          new V1ProofProtocol({
            indyProofFormat: legacyIndyProofFormatService,
          }),
          new V2ProofProtocol({
            proofFormats: [legacyIndyProofFormatService, new AnonCredsProofFormatService()],
          }),
        ],
      }),
      anoncreds: new AnonCredsModule({
        registries: [new IndyVdrAnonCredsRegistry(), new CheqdAnonCredsRegistry()],
      }),
      anoncredsRs: new AnonCredsRsModule({
        anoncreds,
      }),
      indyVdr: new IndyVdrModule({
        indyVdr,
        networks: [indyNetworkConfig],
      }),
      cheqd: new CheqdModule(
        new CheqdModuleConfig({
          networks: [
            {
              network: 'testnet',
              cosmosPayerSeed: process.env.COSMOSPAYERSEED
            },
          ],
        })
      ),
      dids: new DidsModule({
        resolvers: [new IndyVdrIndyDidResolver(), new CheqdDidResolver()],
        registrars: [new CheqdDidRegistrar()],
      }),
      ariesAskar: new AskarModule({
        ariesAskar,
      }),
    } as const
  }
 