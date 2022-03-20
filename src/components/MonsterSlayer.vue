<template>
  <div id="game">
    <section
      id="monster"
      class="container"
    >
      <h2>Monster Health</h2>
      <div class="healthbar">
        <div
          class="healthbar__value"
          :style="monsterBarStyles"
        />
      </div>
    </section>
    <section
      id="player"
      class="container"
    >
      <h2>Your Health</h2>
      <div class="healthbar">
        <div
          class="healthbar__value"
          :style="playerBarStyles"
        />
      </div>
    </section>
    <section
      v-if="winner"
      class="container"
    >
      <h2>Game Over!</h2>
      <h3 v-if="winner === 'monster'">
        You lost!
      </h3>
      <h3 v-else-if="winner === 'player'">
        You won!
      </h3>
      <h3 v-else>
        It's a draw!
      </h3>
      <button @click="reset">
        Start New Game
      </button>
    </section>
    <section 
      v-else 
      id="controls"
    >
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        @click="attackMonster"
      >
        ATTACK
      </button>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        :disabled="mayUseSpecialAttack"
        @click="specialAttack"
      >
        SPECIAL ATTACK
      </button>
      <button
        class="bg-customGreen-600 hover:bg-customGreen-700 text-white font-bold py-2 px-4 rounded-full"
        @click="heal"
      >
        HEAL
      </button>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        @click="surrender"
      >
        SURRENDER
      </button>
    </section>
    <section
      id="log"
      class="container"
    >
      <h2>Battle Log</h2>
      <ul>
        <li
          v-for="log in battleLog"
          :key="log.actionId"
        >
          <span
            :class="{
              'log--player': log.actionBy === 'player',
              'log--monster': log.actionBy === 'monster',
            }"
          >{{ log.actionBy === "player" ? "Player" : "Monster" }}</span>
          <span v-if="log.actionType === 'heal'">
            heals himself for
            <span class="log--heal">{{ log.actionValue }}</span>
          </span>
          <span v-else>
            attacks and deals
            <span class="log--damage">{{ log.actionValue }}</span>
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {v4 as uuidv4} from 'uuid'

const monsterHealth = ref<number>(100)
const playerHealth = ref<number>(100)
const winner = ref<null | string>(null)
const battleLog = ref<{actionBy: string, actionType: string, actionValue: number, actionId: number}[]>([])
const currentRound = ref<number>(0)

const monsterBarStyles = computed((): {width: string} => {
  if (monsterHealth.value <= 0) {
    return { width: '0%' }
  }
  return { width: monsterHealth.value + '%' }
})

const playerBarStyles = computed((): {width: string} => {
  if (playerHealth.value <= 0) {
    return { width: '0%' }
  }
  return { width: playerHealth.value + '%' }
})
const mayUseSpecialAttack = computed((): boolean => {
  return currentRound.value % 3 !== 0
})

watch(monsterHealth, function (value) {
  if (value <= 0 && playerHealth.value <= 0) {
    //A Draw
    winner.value = 'draw'
  } else if (value <= 0) {
    winner.value = 'player'
  }
})
watch(playerHealth, function (value) {
  if (value <= 0 && monsterHealth.value <= 0) {
    winner.value = 'draw'
  } else if (value <= 0) {
    winner.value = 'monster'
  }
})

function getAttackValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min
}

function attackMonster() {
  currentRound.value++
  const monsterDamage = getAttackValue(5, 15)
  monsterHealth.value -= monsterDamage
  addBattleLog('player', 'attack', monsterDamage, uuidv4)
  attackPlayer()
}
function attackPlayer() {
  const playerDamage = getAttackValue(9, 20)
  playerHealth.value -= playerDamage
  addBattleLog('monster', 'attack', playerDamage, uuidv4)
}
function specialAttack() {
  currentRound.value++
  const monsterDamage = getAttackValue(14, 35)
  monsterHealth.value -= monsterDamage
  addBattleLog('player', 'attack', monsterDamage, uuidv4)

  attackPlayer()
}
function heal() {
  currentRound.value++
  const heal = getAttackValue(10, 25)
  if (playerHealth.value + heal > 100) {
    playerHealth.value = 100
  } else {
    playerHealth.value += heal
  }
  addBattleLog('player', 'heal', heal, uuidv4)
  attackPlayer()
}
function addBattleLog(who: string, what: string, value: number, id: number) {
  battleLog.value.unshift({
    actionBy: who,
    actionType: what,
    actionValue: value,
    actionId: id,
  })
}
function reset() {
  monsterHealth.value = 100
  playerHealth.value = 100
  winner.value = null
  battleLog.value = []
}
function surrender() {
  winner.value = 'monster'
}
</script>

<style>
* {
  box-sizing: border-box;
}

html {
  font-family: "Jost", sans-serif;
}

body {
  margin: 0;
}

header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0.5rem;
  background-color: #880017;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
}

section {
  width: 90%;
  max-width: 40rem;
  margin: auto;
}

.healthbar {
  width: 100%;
  height: 40px;
  border: 1px solid #575757;
  margin: 1rem 0;
  background: #fde5e5;
}

.healthbar__value {
  background-color: #00a876;
  width: 100%;
  height: 100%;
}

.container {
  text-align: center;
  padding: 0.5rem;
  margin: 1rem auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 12px;
}

#monster h2,
#player h2 {
  margin: 0.25rem;
}

#controls {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

button {
  font: inherit;
  border: 1px solid #88005b;
  background-color: #88005b;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  margin: 1rem;
  width: 12rem;
  cursor: pointer;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.26);
}

button:focus {
  outline: none;
}

button:hover,
button:active {
  background-color: #af0a78;
  border-color: #af0a78;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.26);
}

button:disabled {
  background-color: #ccc;
  border-color: #ccc;
  box-shadow: none;
  color: #3f3f3f;
  cursor: not-allowed;
}

#log ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

#log li {
  margin: 0.5rem 0;
}

.log--player {
  color: #7700ff;
}

.log--monster {
  color: #da8d00;
}

.log--damage {
  color: red;
}

.log--heal {
  color: green;
}
</style>
