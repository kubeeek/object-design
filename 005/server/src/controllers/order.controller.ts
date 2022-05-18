import {
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param, post, requestBody, response
} from '@loopback/rest';
import {Order} from '../models';
import {OrderRepository, ServiceRepository} from '../repositories';

/* we want only get (all) and post */
export class OrderController {
  constructor(
    @repository(OrderRepository)
    public orderRepository: OrderRepository,

    @repository(ServiceRepository)
    public serviceRepository: ServiceRepository,
  ) { }

  @post('/orders')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {
            title: 'NewOrder',
            exclude: ['id', 'uuid', 'paid'],
          }),
        },
      },
    })
    order: Omit<Order, 'id'>,
  ): Promise<Order> {
    console.log(order);
    return this.orderRepository.create(order);
  }

  @get('/orders')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Order, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Order) filter?: Filter<Order>,
  ): Promise<Order[]> {
    const orderArray: Order[] = await this.orderRepository.find({...filter, fields: {id: false, userId: false}});

    for (const order of orderArray) {
      const items: Object[] = [];
      const keys = Object.keys(order.items);

      for (const key of keys) {
        const service = await this.serviceRepository.findById(parseInt(key));

        items.push({
          name: service.name,
          price: service.price,
          quantity: (order.items as Record<string, number>)[key]
        })
      }

      order.items = items;
    }

    return orderArray;
  }

  @get('/orders/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Order, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Order, {exclude: 'where'}) filter?: FilterExcludingWhere<Order>
  ): Promise<Order> {
    return this.orderRepository.findById(id, filter);
  }

  @post('/orders/{uuid}/pay')
  @response(200, {
    description: 'Mocking pay',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Order, {includeRelations: true}),
      },
    },
  })
  async payByUuId(
    @param.path.string('uuid') uuid: string,
  ): Promise<Order | void> {
    const result = await this.orderRepository.findOne({where: {uuid}})

    if (result === null)
      return;

    result.paid = true;
    return this.orderRepository.save(result);
  }
}
