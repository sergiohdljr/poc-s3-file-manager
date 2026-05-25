import { BaseEntity } from '../../../../shared/domain/base.entity';
import { Email } from '../value-objects/email.vo';
import { UserCreatedEvent } from '../events/user-created.event';

interface UserProps {
  name: string;
  email: Email;
  passwordHash: string;
}

export class User extends BaseEntity {
  private _name: string;
  private _email: Email;
  private _passwordHash: string;

  private constructor(props: UserProps, id?: string) {
    super(id);
    this._name = props.name;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
  }

  static create(props: UserProps): { user: User; event: UserCreatedEvent } {
    const user = new User(props);
    const event = new UserCreatedEvent(user.id, props.email.getValue());
    return { user, event };
  }

  static reconstitute(props: UserProps & { id: string }): User {
    return new User(props, props.id);
  }

  get name() { return this._name; }
  get email() { return this._email.getValue(); }
  get passwordHash() { return this._passwordHash; }
}
