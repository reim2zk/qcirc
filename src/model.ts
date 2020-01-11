export class Circuit {
    numQbit: number
    numPosition: number = 10
    gates: Gate[]
    unitWidth: number = 20
    unitHeight: number = 30
    constructor(numQBit: number, gates: Gate[]) {
        this.numQbit = numQBit
        this.gates = gates
    }
    width(): number { return this.numPosition * this.unitWidth }
    height(): number { return (this.numQbit+1) * this.unitHeight }    
    wireYs(): number[] { 
        let ys = []
        for(let i = 0; i < this.numQbit; i++) {
            ys.push( (i + 1) * this.unitHeight)
        }
        return ys
    }
}

export class Gate {
    indexQbit: number
    position: number
    width: number = 20
    height: number = 30
    diameter: number = 15
    text: string
    color: string
    constructor(indexQbit:number, position: number, text: string, color: string) {
        this.indexQbit = indexQbit
        this.position = position
        this.text = text
        this.color = color
    }
    x(): number { return (this.position+1) * this.width - this.diameter/2}
    y(): number { return (this.indexQbit+1) * this.height - this.diameter/2}
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
