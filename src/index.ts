import Vue from 'vue';
import {Gate, Hadamal, XGate, YGate, ZGate, OneGate, Circuit, GateType, Qbit, QbitType, ControledNot} from './model'

enum PositionType {
    InitQbit = -1,
    Gate = -2,
    Measure = -3
}
class CircuitView {
    unitWidth: number
    unitHeight: number
    gateRadius: number
    dotRadius: number    
    qbitWidth: number
    measureWidth: number
    constructor(unitWidth: number, unitHeight: number, gateRadius: number) {
        this.unitHeight = unitHeight
        this.unitWidth = unitWidth
        this.gateRadius = gateRadius
        this.dotRadius = gateRadius * 0.3
        this.qbitWidth = unitWidth * 1.5
        this.measureWidth = unitWidth * 1.3
    }
    width(): number { 
        return this.qbitWidth + circuit.numPosition * this.unitWidth + this.measureWidth
    }
    height(): number { 
        return (circuit.numQbit+1) * circuitView.unitHeight 
    }
    position(x: number): number | PositionType.InitQbit | PositionType.Measure { 
        if(x < this.qbitWidth) {
            return PositionType.InitQbit
        } else if (x > this.qbitWidth + this.unitWidth * 10) {
            return PositionType.Measure
        } else {
            return Math.floor((x - this.qbitWidth) / this.unitWidth) 
        }
    }
    indexQbit(y: number): number { 
        return Math.floor(y / this.unitHeight) 
    }
    x(position: number): number { 
        return (position + 0.5) * this.unitWidth + this.qbitWidth
    }
    y(indexQbit: number): number { 
        return (indexQbit + 0.5) * this.unitHeight 
    }    
}

const circuit = new Circuit(
    [
        new ControledNot(2, 3, 3),
        new Hadamal(1, 2),
        new XGate(1, 4),
        new Hadamal(2, 0)
    ], 
    [
        new Qbit(QbitType.Q0, true), 
        new Qbit(QbitType.Q0, false), 
        new Qbit(QbitType.Q1, true), 
        new Qbit(QbitType.Q0, false), 
        new Qbit(QbitType.Q0, false)
    ])
const circuitView = new CircuitView(20, 20, 9)

let selectedOneGate: Gate | null = null
let partIndex: number = 0
function down(e: MouseEvent) {
    if(!selectedOneGate) {
        const position = circuitView.position(e.offsetX)
        if (position == PositionType.InitQbit) {
            const indexQbit = circuitView.indexQbit(e.offsetY)
            circuit.qbits[indexQbit].swapQbit()
        } else if (position == PositionType.Measure) {
            const indexQbit = circuitView.indexQbit(e.offsetY)
            circuit.qbits[indexQbit].swapMeasure()
        } else {
            const indexQbit = circuitView.indexQbit(e.offsetY)
            const res = circuit.findGate(position, indexQbit)
            if(res) {
                selectedOneGate = res.gate
                partIndex = res.index
            }        
        }
    }
}
function move(e: MouseEvent) {
    if(selectedOneGate) {
        const pos = circuitView.position(e.offsetX)
        const iqb = circuitView.indexQbit(e.offsetY)
        selectedOneGate.setPositionIndexQbit(pos, iqb, partIndex)
    }
}
function up(e: MouseEvent) {
    if(selectedOneGate) {
        selectedOneGate = null
    }
}
function add(gateType: GateType) {
    if(!selectedOneGate) {
        const gate = circuit.emptyGate(gateType)
        if(gate instanceof OneGate) {
            selectedOneGate = gate
        }
        circuit.gates.push(gate)
    }
}

Vue.component('circuit-ui', {
    data: function() {
        return {
            gateNameTypes: [
                {name: "H", type: GateType.H},
                {name: "X", type: GateType.X},
                {name: "Y", type: GateType.Y},
                {name: "Z", type: GateType.Z},
                {name: "CN", type: GateType.CN}
            ]
        }
    },
    methods: {
        add: add
    },
    template: `
    <span>
        <button v-for="nameType in gateNameTypes" 
        v-on:click="add(nameType.type)">
        {{nameType.name}}
        </button>        
    </span>
    `
})

Vue.component('circuit', {
    data: function() {
        return {
            circuit: circuit,
            circuitView: circuitView
        }
    },
    methods: {
        move: move,
        down: down,
        up: up,
        wireX0: function(): number { return circuitView.qbitWidth},
        wireX1: function(): number { return circuitView.x(circuit.numPosition) - circuitView.unitWidth/2},
        qbits: function(): {y: number, text: string, measure: boolean}[] {
            const res = circuit.qbits.map((v, i) => {
                const y = circuitView.y(i)
                let text = ""
                if(v.type == QbitType.Q0) {
                    text = "0"
                } else if (v.type == QbitType.Q1) {
                    text = "1"
                }
                text = "|" + text + ">"
                return {y: y, text: text, measure: v.measure}
            })
            return res
        },
        pathSvg: function(y: number): string {
            const r = this.circuitView.gateRadius
            const x0 = this.wireX1() - r
            const y0 = y + r
            const path = `M ${x0},${y0} a ${r} ${r} 180 0 1 ${r*2},0`
            return path
        }
    },
    template: `
    <svg 
        v-bind:width="circuitView.width()" 
        v-bind:height="circuitView.height()" 
        v-on:mousemove="move"
        v-on:mousedown="down"
        v-on:mouseup="up">
        <template v-for="qbit in qbits()">
            <line
                :x1="wireX0()" 
                :y1="qbit.y" 
                :x2="wireX1()" 
                :y2="qbit.y" 
                stroke="black"></line>
            <text
                x="0" 
                :y="qbit.y-1" 
                text-anchor="left" 
                dominant-baseline="central"
                style="user-select: none"
            >
                {{ qbit.text }}
            </text>
            <rect
                v-if="qbit.measure"
                :x="wireX1() - circuitView.gateRadius"
                :y="qbit.y   - circuitView.gateRadius"
                :width="circuitView.gateRadius*2"
                :height="circuitView.gateRadius*2"
                fill="green">
            </rect>
            <path v-if="qbit.measure" :d="pathSvg(qbit.y)" fill="none" stroke="black"/>
            <line v-if="qbit.measure" 
                :x1="wireX1()" 
                :y1="qbit.y+circuitView.gateRadius" 
                :x2="wireX1()+2*circuitView.gateRadius*0.3"
                :y2="qbit.y-2*circuitView.gateRadius*0.8 + circuitView.gateRadius" 
                stroke="black">
            </line>
        </template>        
        <template v-for="gate in circuit.gates">
            <gate :gate="gate" :circuitView="circuitView"></gate>
        </template>
    </svg>
    `
})

Vue.component('gate', {
    props: {
        gate: Gate,
        circuitView: CircuitView
    },
    methods: {
        controledNot: function(): ControledNot | null {
            return this.gate instanceof ControledNot ? this.gate : null
        },
        oneGate: function(): OneGate | null {
            return this.gate instanceof OneGate ? this.gate : null
        }
    },
    template: `
    <controled-not v-if="controledNot()" 
        :gate="controledNot()"
        :radiusControl="circuitView.gateRadius * 0.4"
        :radiusTarget="circuitView.gateRadius"
        :circuitView="circuitView"
        >
    </controled-not>    
    <one-gate v-else-if="oneGate()" 
        :gate="oneGate()"
        :diameter="circuitView.gateRadius * 2"
        :circuitView="circuitView"
        >
    </one-gate>
    `    
})
Vue.component('controled-not', {
        props: {
            gate: ControledNot,
            circuitView: CircuitView
        },
        methods: {
            x: function(): number { 
                return circuitView.x(this.gate.position)
            },
            yControl: function(): number { 
                return circuitView.y(this.gate.indexQbitControl) 
            },
            yNot: function(): number { 
                return circuitView.y(this.gate.indexQbitNot)
            },
        },
        template: `<svg>
        <line 
            :x1="x()" 
            :x2="x()" 
            :y1="yControl()" 
            :y2="yNot()" 
            stroke="black"/>
        <circle
            :cx="x()"
            :cy="yControl()"
            :r="circuitView.dotRadius"
            fill="black">
        </circle>
        <circle
            :cx="x()"
            :cy="yNot()"
            :r="circuitView.gateRadius"
            stroke="black"
            fill="white">
        </circle>
        <text 
            :x="x()" :y="yNot()-1" 
            :font-size="circuitView.radiusGate*2" 
            text-anchor="middle" 
            dominant-baseline="central"
            style="user-select: none">
            +
        </text>
    </svg>
        `
    })
Vue.component('one-gate', {
        props: {
            gate: OneGate,
            diameter: Number,
            circuitView: CircuitView
        },
        methods: {
            color: function(): string {
                switch(this.gate.type) {
                    case GateType.H: return "cyan"; break
                    default: return "yellow";  break
                }
                return "white"
            },
            text: function(): string {
                switch(this.gate.type) {
                    case GateType.H: return "H"; break
                    case GateType.X: return "X"; break
                    case GateType.Y: return "Y"; break
                    case GateType.Z: return "Z"; break
                }
                return "NotFound"
            },
            x: function(): number { 
                return this.circuitView.x(this.gate.position)
            },
            y: function(): number { return this.circuitView.y(this.gate.indexQbit) }
        },
        template: `<svg>
        <rect
            v-bind:x="x() - diameter / 2"
            v-bind:y="y() - diameter / 2" 
            v-bind:width="diameter" 
            v-bind:height="diameter"
            :fill="color()"
        >    
        </rect>
        <text 
            :x="x()" :y="y()" :font-size="diameter" 
            text-anchor="middle" dominant-baseline="central"
            style="user-select: none">
            {{ text() }}
        </text>
        </svg>
        `
    })

new Vue(
{
    el: '#app',
    data: {
        circuit: circuit,
        circuitView: circuitView,
    }
})
