class Validator {

    private name: string;
    private amountStaked: number;
    private pendingReward: number;
    
    constructor(validator: IValidator) {
        this.name = validator.name;
        this.amountStaked = validator.amountStaked;
        this.pendingReward = validator.pendingReward;
    }

    public getName(): string {
        return this.name
    }
    
    public getAmountStaked(): number {
        return this.amountStaked;
    }

    public getPendingRewards(): number {
        return this.pendingReward;
    }
    
}

interface IValidator {
    name: string;
    amountStaked: number;
    pendingReward: number;
}

export { Validator, IValidator }