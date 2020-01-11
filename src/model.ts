export class Gate {
    indexQbit: number
    position: number
    width: number = 20
    height: number = 20
    text: string
    color: string
    constructor(indexQbit:number, position: number, text: string, color: string) {
        this.indexQbit = indexQbit
        this.position = position
        this.text = text
        this.color = color
    }
    x(): number { return this.position * this.width}
    y(): number { return this.indexQbit * this.height}
}

export class Hadamal extends Gate {    
    constructor(indexQbit:number, position: number) {
        super(indexQbit, position, "H", "black")
    }    
}

export class XGate extends Gate {    
    constructor(indexQbit:number, position: number) {
        super(indexQbit, position, "X", "red")
    }    
}
