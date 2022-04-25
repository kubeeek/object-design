import {Entity, model, property} from '@loopback/repository';

@model()
export class Order extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    index: true,
    defaultFn: "uuidv4"
  })
  uuid?: string;

  @property({
    type: 'number',
    required: true,
  })
  userId?: number;

  @property({
    type: 'object',
    required: true,
  })
  items: object;

  @property({
    type: 'boolean',
    default: false
  })
  paid: boolean;


  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;
