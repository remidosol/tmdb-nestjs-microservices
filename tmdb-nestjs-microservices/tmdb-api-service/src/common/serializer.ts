import {
  Deserializer,
  IncomingRequest,
  OutgoingRequest,
  Serializer,
} from "@nestjs/microservices";
import {
  KafkaRequestSerializer,
  KafkaRequest,
} from "@nestjs/microservices/serializers";
import { KafkaRequestDeserializer } from "@nestjs/microservices/deserializers";
import { KafkaHeaders } from "@nestjs/microservices/enums";
import {
  KafkaMessage,
  IHeaders,
} from "@nestjs/microservices/external/kafka.interface";
import { v4 as uuidv4 } from "uuid";
import { LoggerService } from "../logger/services";
import { catchError } from "./util.functions";

type BatchContext = {
  firstOffset: string;
  firstTimestamp: string;
  partitionLeaderEpoch: number;
  inTransaction: boolean;
  isControlBatch: boolean;
  lastOffsetDelta: number;
  producerId: string;
  producerEpoch: number;
  firstSequence: number;
  maxTimestamp: string;
  timestampType: number;
  magicByte: number;
};

export type Message = {
  magicByte: number;
  attributes: number;
  timestamp: string;
  offset: string;
  key: Buffer | string | null;
  value: any | any[];
  headers: IHeaders;
  isControlRecord: boolean;
  batchContext: BatchContext;
  topic: string;
  partition: number;
};

export class JsonAndStringSerializer extends KafkaRequestSerializer {
  constructor(private logger: LoggerService) {
    super();
    this.logger.setOrganizationAndContext(JsonAndStringSerializer.name);
  }

  serialize(value: any): OutgoingRequest {
    try {
      console.log("JsonAndStringSerializer - value", value);
      const outgoingMessage = super.serialize(value);

      const id = uuidv4();

      outgoingMessage.pattern = value.pattern;
      outgoingMessage.data = JSON.stringify(value.data);

      outgoingMessage.headers = {
        ...outgoingMessage.headers,
        [KafkaHeaders.CORRELATION_ID]: id,
      };

      return outgoingMessage;
    } catch (err) {
      console.error("Serialization error:", err);
      throw catchError(err, this.logger);
    }
  }

  encode(value: any): Buffer | string | null {
    return super.encode(value);
  }
}

export class JsonAndStringDeserializer extends KafkaRequestDeserializer {
  constructor(private logger: LoggerService) {
    super();
    this.logger.setOrganizationAndContext(JsonAndStringDeserializer.name);
  }

  deserialize(value: Message, options?: Record<string, any>): IncomingRequest {
    console.log("JsonAndStringDeserializer - value", value);
    try {
      return {
        id: value.headers[KafkaHeaders.CORRELATION_ID] as string,
        pattern: value.topic.includes(".")
          ? value.topic.split(".")[1]
          : value.topic,
        data: value.value,
      };
    } catch (error) {
      console.error("Deserialization error:", error);
      throw catchError(error, this.logger);
    }
  }
}
