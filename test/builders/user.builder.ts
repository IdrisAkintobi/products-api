import { User } from '../../src/db/schemas/user.schema';

export class UserBuilder {
    private user: User = {
        id: 'User Id',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        password: 'QWE123qwe!@#',
    };

    constructor() {}

    public withEmail(email: string): UserBuilder {
        this.user.email = email;
        return this;
    }

    public withPassword(password: string): UserBuilder {
        this.user.password = password;
        return this;
    }

    public buildUpdate(): Partial<User> {
        return {
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            password: this.user.password,
        };
    }

    public build(): User {
        return this.user;
    }

    public toObject(): User {
        return this.user;
    }
}
