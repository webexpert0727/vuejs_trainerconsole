<template>
  <container>
  <header class="live-run-inner">
    <race-table-list subtitle="finished" :races="racesFinished" message-empty-list="There's no finished races" type="resume"></race-table-list>
   </header>
  </container>
</template>
<script>
import Container from '@/components/Container'
import RaceList from '@/components/Race/RaceList'
import RaceTableList from '@/components/Race/RaceTableList'
import RaceHeader from '@/components/Race/Header'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'past-run',
  data () {
    return {
      racesFinished: []
    }
  },
  computed: {
    ...mapGetters({
      trainer: 'Trainer/trainer',
      races: 'RacesByTrainer/races',
    })
  },
  methods: {
    initialize () {
      this.addTaskToQueue('getTrainer')
      this.addTaskToQueue('getRacesByTrainer')

      this.getTrainer(this.$auth.user().id)
        .then(() => {
          this.removeTaskFromQueue('getTrainer')
        })
    },
    getRaces () {
      this.getRacesByTrainer(this.trainer.id)
        .then(() => {
          this.removeTaskFromQueue('getRacesByTrainer')
        })
    },
    setRacesFinished () {
      this.racesFinished = this.races.filter((race) => race.startDate !== null && race.finishDate !== null)
    },
    ...mapActions({
      getTrainer: 'Trainer/get',
      getRacesByTrainer: 'RacesByTrainer/get',
      addTaskToQueue: 'LoadingQueue/addTaskToQueue',
      removeTaskFromQueue: 'LoadingQueue/removeTaskFromQueue'
    })
  },
  created () {
    this.initialize()
  },
  watch: {
    trainer () {
      this.getRaces()
    },
    races () {
      this.setRacesFinished()
    }
  },
  components: {
    RaceList,
    Container,
    RaceHeader,
    RaceTableList
  }
}
</script>
