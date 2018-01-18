<template>
  <container>
    <div class="live-run__content only-flex">
      <race-header></race-header>
      <runners></runners>
      <trainer-notes></trainer-notes>
      <infos></infos>
    </div>
  </container>
</template>

<script>
import Container from '@/components/Container'
import RaceHeader from '@/components/LiveRun/Race/Header'
import Runners from '@/components/LiveRun/Race/Runners'
import TrainerNotes from '@/components/LiveRun/Race/TrainerNotes'
import Infos from '@/components/LiveRun/Race/Infos'

export default {
  name: 'race',
  created () {
    this.$store.dispatch('Race/get', this.$route.params.raceId)
  },
  components: {
    Container,
    RaceHeader,
    Runners,
    TrainerNotes,
    Infos
  }
}
</script>
