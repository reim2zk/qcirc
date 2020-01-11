import Vue from 'vue';

class Gate {
    indexQbit: number
    position: number
    text: string
    color: string
    constructor(indexQbit:number, position: number, text: string, color: string) {
        this.indexQbit = indexQbit
        this.position = position
        this.text = text
        this.color = color
    }
}
class Hadamal extends Gate {    
    constructor(indexQbit:number, position: number) {
        super(indexQbit, position, "H", "black")
    }    
}
class XGate extends Gate {    
    constructor(indexQbit:number, position: number) {
        super(indexQbit, position, "X", "black")
    }    
}

const gates: Gate[] = [
    new Hadamal(0, 1),
    new Hadamal(1, 2),
    new XGate(1, 4)
]

Vue.component('gate', {
    props: {
        gate: Gate,
        width: {type: Number, default: 20},
        height: {type: Number, default: 20},
    },
    methods: {
        x: function(): number {
            return this.gate.position * this.width
        },
        y: function(): number {
            return this.gate.indexQbit * this.height
        },
        color: function(): string {
            if(this.gate instanceof Hadamal) {
                return "red"
            } else if (this.gate instanceof XGate) {
                return "blue"                
            } else {
                return "yellow"
            }
        },
        select: function(e: any): void {
            console.log("select")
            console.log(this.$emit)
            this.$emit.selectGate(e, this)
        }
    },
    template: `<rect
        v-bind:x="x()" v-bind:y="y()" 
        v-bind:width="this.width" v-bind:height="height"
        v-bind:stroke="color()"
        fill="white"
        v-on:click="select"
    ></rect>
    `
})

new Vue(
{
    el: '#app',
    data: {
        title: 'he',
        x: 10,
        y: 10,
        gates: gates
    },
    filters: {
        strPlus2: function (value: string): string {
            return value + "2"
        }
    },
    methods: {
        selectGate: function (event: any, gate: Gate): void {
            console.log("my click")
            console.log(gate)
            console.log(event)
            console.log(event.toElement)
            this.x += 1
        }
    }
})
