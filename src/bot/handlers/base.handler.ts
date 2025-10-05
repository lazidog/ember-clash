import { Injectable } from '@nestjs/common';
import { MezonClient } from 'mezon-sdk';
import { MezonClientService } from 'src/mezon/client.service';

@Injectable()
export abstract class BaseEventHandler {
  protected client: MezonClient;
  constructor(clientService: MezonClientService) {
    this.client = clientService.getClient();
  }
}