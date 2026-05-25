export abstract class DomainEvent {
  readonly occurredAt: Date;
  constructor(public readonly aggregateId: string) {
    this.occurredAt = new Date();
  }
}
