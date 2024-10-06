import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { KafkaMessage } from "kafkajs";

@Injectable()
export class KafkaPayloadPipe implements PipeTransform {
  transform(value: KafkaMessage, _metadata: ArgumentMetadata) {
    return value.value;
  }
}
