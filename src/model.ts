export enum GateType {H, X, CN}
export function gateTypeName(gateType: GateType): string | null{
    const map = new Map([[GateType.H, "H"], [GateType.X, "X"]])
    const res = map.get(gateType)
    return res ? res : null
}


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
    findOneGate(x: number, y: number): OneGate | null {
        const oneGates: OneGate[] = this.gates.flatMap(v => {
            if(v instanceof OneGate) {
                return [v]
            } else {
                return []
            }
        })
        const position = this.position(x)
        const indexQbit = this.indexQbit(y)
        const res = oneGates.find(gate => gate.position == position && gate.indexQbit == indexQbit)
        return res ? res : null
    }
    emptyGate(type: GateType): Gate {
        let g: Gate
        switch(type) {
            case GateType.H: g = new Hadamal(this, 0, 0); break
            case GateType.X: g = new XGate(this, 0, 0); break
            case GateType.CN: g = new ControledNot(this, 0, 1, 0); break
        }
        return g
    }
}

export class Gate {
    type: GateType
    readonly circuit: Circuit
    constructor(type: GateType, circuit: Circuit) {
        this.type = type
        this.circuit = circuit
    }
}

export class ControledNot extends Gate {
    indexQbitControl: number
    indexQbitNot: number
    position: number
    constructor(circuit: Circuit, indexQbit1: number, indexQbit2: number, position: number) {
        super(GateType.CN, circuit)
        this.indexQbitControl = indexQbit1
        this.indexQbitNot = indexQbit2
        this.position = position
    }
    x(): number { return this.circuit.x(this.position, 0) } 
    yControl(): number { return this.circuit.y(this.indexQbitControl, 0) }
    yNot(): number { return this.circuit.y(this.indexQbitNot, 0) }
}
export class OneGate extends Gate {
    indexQbit: number
    position: number
    diameter: number = 15
    constructor(type: GateType, circuit: Circuit, indexQbit:number, position: number) {
        super(type, circuit)
        this.indexQbit = indexQbit
        this.position = position
    }
    width(): number { return this.circuit.unitWidth }
    height(): number { return this.circuit.unitHeight }
    rx(): number { return this.x() - this.diameter / 2 }
    ry(): number { return this.y() - this.diameter / 2 }
    x(): number { return this.circuit.x(this.position, 0) } 
    y(): number { return this.circuit.y(this.indexQbit, 0) }
    setX(x: number): void { 
        this.position = this.circuit.position(x)
    } 
    setY(y: number): void { 
        this.indexQbit = this.circuit.indexQbit(y)
    }
}

export class Hadamal extends OneGate {    
    constructor(circuit: Circuit, indexQbit: number, position: number) {
        super(GateType.H, circuit, indexQbit, position)
    }    
}

export class XGate extends OneGate {
    constructor(circuit: Circuit, indexQbit: number, position: number) {
        super(GateType.X, circuit, indexQbit, position)
    }    
}
