import Vue from 'vue';

interface Gate {
    indexQbit: number
    position: number
}
class Hadamal implements Gate {    
    indexQbit: number
    position: number
    constructor(indexQbit:number, position: number) {
        this.indexQbit = indexQbit
        this.position = position
    }    
}
class XGate implements Gate {
    indexQbit: number
    position: number
    constructor(indexQbit:number, position: number) {
        this.indexQbit = indexQbit
        this.position = position
    }
}

const gates: Hadamal[] = [
    new Hadamal(0, 1),
    new Hadamal(1, 2)
]

Vue.component('hadamal', {
    props: {
        gate: Hadamal,
        width: {type: Number, default: 20},
        height: {type: Number, default: 20},
    },
    methods: {
        x: function(): number {
            return this.gate.indexQbit * this.height
        },
        y: function(): number {
            return this.gate.position * this.width
        },
    },
    template: `<rect 
        v-bind:x="x()"
        v-bind:y="y()"
        v-bind:width="width" 
        v-bind:height="height"> {{x}}
    </rect>`
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
