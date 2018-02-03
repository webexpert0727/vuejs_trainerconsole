<template>
  <div class="runners">
    <box>
      <box-header title="TOP 3 RUNNERS" v-if="race.startDate !== null && race.finishDate === null"></box-header>
      <box-content v-if="race.startDate !== null && race.finishDate === null">
        <top-three :race-id="$route.params.raceId"></top-three>
      </box-content>
      <box-header :title="titleRunnersList"></box-header>
      <box-content>
        <runners-list :runners="runners"></runners-list>
      </box-content>
    </box>
  </div>
</template>

<script>
import Box from '@/components/Box/Box'
import BoxHeader from '@/components/Box/BoxHeader'
import BoxContent from '@/components/Box/BoxContent'
import TopThree from '@/components/LiveRun/Race/TopThreeRunners'
import RunnersList from '@/components/Runners/RunnersList'
import { mapGetters } from 'vuex'

export default {
  name: 'race-runners',
  data: () => ({
    titleRunnersList: ''
  }),
  computed: mapGetters({
    race: 'Race/race',
    runners: 'Race/runners'
  }),
  watch: {
    race() {
      setInterval(() => {
        if(this.$route.params.raceId > 0)
        this.$store.dispatch('Race/getRunners', this.$route.params.raceId)
      }, 1000)
    },
    runners() {
      const isStartedRace = this.race.startDate !== null && this.race.finishDate === null
      this.titleRunnersList = isStartedRace === false ? 'RUNNERS WAITING' : `LIVE RUNNING NOW (${this.runners.length})`
    }
  },
  components: {
    Box,
    BoxHeader,
    BoxContent,
    TopThree,
    RunnersList
  }
}
</script>
