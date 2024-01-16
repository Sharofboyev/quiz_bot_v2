export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFound";
    }
}

export class QuestionNotFoundError extends NotFoundError {
    constructor(message?: string) {
        super(message || "Question not found");
        this.name = "QuestionNotFound";
    }
}

export class UserNotFoundError extends NotFoundError {
    constructor(message?: string) {
        super(message || "User not found");
        this.name = "UserNotFound";
    }
}
