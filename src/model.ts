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
            ys.push(this.y(i, 0.0))
        }
        return ys
    }
    x(position: number, r: number): number { return (position+0.5) * this.unitWidth - r}
    y(indexQbit: number, r: number): number { return (indexQbit+0.5) * this.unitHeight - r}
    position(x: number): number { return Math.floor(x / this.unitWidth) }
    indexQbit(y: number): number { return Math.floor(y / this.unitHeight) }
}

export class Gate {}

export class CNot extends Gate {
    readonly circuit: Circuit
    indexQbit1: number
    indexQbit2: number
    position: number
    diameter: number = 5
    controlGate: ControlGate
    notGate: NotGate
    constructor(circuit: Circuit, indexQbit1: number, indexQbit2: number, position: number) {
        super()
        this.circuit = circuit
        this.indexQbit1 = indexQbit1
        this.indexQbit2 = indexQbit2
        this.position = position
        this.controlGate = new ControlGate(circuit, indexQbit1, position)
        this.notGate = new NotGate(circuit, indexQbit2, position)
    }
    x(): number { return this.circuit.x(this.position, 0) }
    y1(): number { return this.circuit.y(this.indexQbit1, 0) }
    y2(): number { return this.circuit.y(this.indexQbit2, 0) }
}

export class OneGate extends Gate {
    readonly circuit: Circuit    
    indexQbit: number
    position: number
    
    diameter: number = 15
    constructor(circuit: Circuit, indexQbit:number, position: number) {
        super()
        this.circuit = circuit
        this.indexQbit = indexQbit
        this.position = position
    }
    width(): number { return this.circuit.unitWidth }
    height(): number { return this.circuit.unitHeight }
    x(): number { return this.circuit.x(this.position, this.diameter/2) }
    y(): number { return this.circuit.y(this.indexQbit, this.diameter/2) }
    setX(x: number): void { 
        this.position = this.circuit.position(x)
    } 
    setY(y: number): void { 
        this.indexQbit = this.circuit.indexQbit(y)
    }
}

export class ControlGate extends OneGate {
    constructor(circuit: Circuit, indexQbit: number, position: number) {
        super(circuit, indexQbit, position)
    }
}

export class NotGate extends OneGate {
    constructor(circuit: Circuit, indexQbit: number, position: number) {
        super(circuit, indexQbit, position)
    }
}

export class Hadamal extends OneGate {    
    constructor(circuit: Circuit, indexQbit: number, position: number) {
        super(circuit, indexQbit, position)
    }    
}

export class XGate extends OneGate {
    constructor(circuit: Circuit, indexQbit: number, position: number) {
        super(circuit, indexQbit, position)
    }    
}
