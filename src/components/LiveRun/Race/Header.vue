<template>
  <header>
    <div class="flex live-run">
      <h1 class="title">LIVE RUN</h1>
      <label id="Runner">Runners Waiting 73</label>
      <div class="actions" v-if="Object.keys(race).length >= 0">
        <div id="app-buttons">
          <button id="Standby" class="btn btn--primary" @click="showQuestionModalNow()">StandBy</button>
            <button id="live-button" class="btn btn--primary" @click="handleClickLiveButton" v-if="textLiveButton !== 'Finished' && raceFirebase.statusLive !== 'finished'" :disabled="(textActionButton === 'Start race' && textLiveButton === 'Finish live') || textActionButton === 'Finish race' || loadingUpdate">{{ textLiveButton }}</button>
           <button id="StartRun"  class="btn btn--primary">Start Run</button>
          <button id="FinishRun" class="btn btn--primary" @click="resetTimer">Finish Run</button>
         
          <button id="race-button" class="btn btn--primary" @click="handleClickActionButton" v-if="textActionButton !== '' && raceFirebase.status !== 'finished'" :disabled="textLiveButton === 'Start Live' || loadingUpdate">{{ textActionButton }}</button>
         
        </div>
        <div class="headertimers">
          <remaining-time></remaining-time>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="description">
        <div class="name">{{ race.name }} with {{ trainer.firstName }} {{ trainer.lastName }}</div>
      </div>
    </div>
    <race-question :show="showQuestionModal"></race-question>

    <span id="date">{{Date()}}</span>
    <!-- <modal v-if="showModal" @close="showModal = false">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
              <div class="modal-header">
                <h3>
                  Today's Question
                </h3>
              </div>
              <div class="modal-body">
                <input type='text' id="Question" Placeholder="Today's Question?" />
              </div>
              <div class="modal-footer">
                <slot name="footer">
                  <button class="modal-default-button" @click="Send()">Send</button>
                </slot>
                <slot name="footer">
                </slot>
              </div>
            </div>
          </div>
        </div>
      </modal> -->
  </header>
</template>

<script>
  import Pace from '@/utils/calculation/Pace'
  import RaceResumeService from '@/services/raceResume'
  import RemainingTime from './RemainingTime'
  import RaceQuestion from './Question'

  import {
    mapGetters,
    mapActions
  } from 'vuex'
  import {
    db
  } from '../../../firebase'
  import {
    project
  } from 'ramda'
  let intervalPace = null
  export default {
    name: 'race-header',
    data: () => ({
      textActionButton: '',
      textLiveButton: '',
      statusLive: false,
      raceFirebase: {},
      loadingUpdate: false,
      el: '#app',
      due: '2017-01-01',
      mydate: new Date(),
      showModal: false,
      remainingTime: '00:00:00',
      startDate: Date.now,
      counter: 0,
      my_timer: 0,
      showQuestionModal: false
    }),
    computed: mapGetters({
      race: 'Race/race',
      trainer: 'Trainer/trainer',
      template: '#modal-template'
      // template: '#bs-modal'
    }),
    firebase: {
      racers: db.ref('racers')
    },
    methods: {
      showQuestionModalNow() {
        console.log(this.showQuestionModal)
        this.showQuestionModal = true
      },
      initialize() {
        this.$on('closed', ()=>{
          this.showQuestionModal = false
        })
      },
      getTextActionButton() {
        if (this.race.startDate === null && this.race.finishDate === null) {
          return 'Start Race'
        } else if (this.race.startDate !== null && this.race.finishDate === null) {
          this.savePaceRunners()
          return 'Finish Race'
        } else {
          return ''
        }
      },
      getTextLiveButton() {
        if (this.raceFirebase['.value'] === undefined && this.raceFirebase.statusLive === 'started') {
          return 'Finish Live'
        } else if (this.raceFirebase['.value'] === undefined && this.raceFirebase.statusLive === 'finished') {
          return 'Finished'
        } else {
          return 'Start Live'
        }
      },
      startRace() {
        let race = {
          status: 'running',
          runners: [],
          raceResumeId: ''
        }
        this.textActionButton = 'Starting...'
        this.loadingUpdate = true
        this.$firebaseRefs.racers
          .child(this.$route.params.raceId)
          .update(race)

        return this.$store
          .dispatch('Race/start', this.$route.params.raceId)
          .then(() => {
            const raceResume = {
              totalAmountRunners: 0,
              startDate: new Date().toISOString(),
              race: this.race
            }
            return this.createRaceResume(raceResume)
          })
          .then((raceResumeResult) => this.$firebaseRefs.racers.child(this.$route.params.raceId).update({
            'raceResumeId': raceResumeResult.body.id
          }))
          .then(this.$firebaseRefs.racers.child(this.$route.params.raceId).update({
            'startDateTime': Date.now()
          }))
          .then(() => {
            this.loadingUpdate = false
            this.textActionButton = 'Finish Race'
          })
      },
      finishRace() {
        let _this = this
      return RaceResumeService.get(this.raceFirebase.raceResumeId)
          .then(({
            data
          }) => {
            clearInterval(intervalPace)

          const runnersIds = Object.keys(this.raceFirebase.runners)

          const runners = runnersIds.map(runnerId => {
            return this.raceFirebase.runners[runnerId]
          })

          const totalAmountRunners = runners.reduce((accumulator, currentValue) => {
            if (currentValue !== undefined) {
              return accumulator + 1
            }
            return accumulator
          }, 0)

            const raceResume = {
              id: data.id,
              finishDate: new Date().toISOString(),
              startDate: data.startDate,
              race: data.race,
            totalAmountRunners: totalAmountRunners
            }
            RaceResumeService.update(raceResume)
              .then(() => {
                this.$firebaseRefs.racers.child(this.$route.params.raceId).update({
                  'status': 'finished'
                })

                this.textActionButton = 'Finishing...'
                this.loadingUpdate = true

                return this.$store
                  .dispatch('Race/finish', this.$route.params.raceId)
                  .then(() => {
                    this.$router.push({
                      path: `/admin/live-run/race/${this.$route.params.raceId}/resume`
                    })
                    this.loadingUpdate = false
                    this.textActionButton = 'Finish Race'
                  })
              })
          })
      },
      resetTimer() {
        clearInterval(this.my_timer)
      },
      timerFormat(timer) {
        return timer > 9 ? timer : '0' + timer
      },
      startLive() {
        this.$firebaseRefs.racers.child(this.$route.params.raceId).update({
          'statusLive': 'started'
        })
      },
      finishLive() {
        this.$firebaseRefs.racers.child(this.$route.params.raceId).update({
          'statusLive': 'finished'
        })
      },
      emit() {
        this.showModal = false
      },
      No() {
        this.StartRun = false
        this.FinishRun = false
      },
      Yes() {
        this.StartRun = false
        this.FinishRun = false
      },
      Send() {
        this.showModal = false
      },
      getFunctionActionButton() {
        return {
          'Start Race': 'startRace',
          'Finish Race': 'finishRace'
        }[this.textActionButton]
      },
       getFunctionLiveButton () {
      return {
        'Start live': 'startLive',
        'Finish live': 'finishLive'
      }[this.textLiveButton]
    },
      handleClickActionButton() {
        let _this = this
        this[_this.getFunctionActionButton()]()
          .then(() => {
            _this.$store.dispatch('Race/get', this.$route.params.raceId)
          })
      },
      handleClickLiveButton () {
      this[this.getFunctionLiveButton()]()
    },
      ...mapActions({
        createRaceResume: 'RaceResume/createOne'
      }),
      savePaceRunners() {
        intervalPace = setInterval(() => {
          const runners = project(['id', 'distance', 'lastDistance', 'pace'], this.runnersFirebase)

          runners.forEach((runner, key) => {
            const lastDistance = runner.lastDistance ? runner.lastDistance : 0

            db.ref(`/racers/${this.$route.params.raceId}/runners`)
              .child(runner.id)
              .update({
                pace: Pace(runner.distance - lastDistance, runner.pace),
                lastDistance: runner.distance
              })
          })
        }, 60000)
      }
    },
    watch: {
      race() {
        this.textActionButton = this.getTextActionButton()
      },
      raceFirebase() {
        this.textLiveButton = this.getTextLiveButton()
      }
    },
    created() {
      this.initialize()
      this.$bindAsObject('raceFirebase', db.ref(`/racers/${this.$route.params.raceId}`))

      db.ref(`/racers/${this.$route.params.raceId}/runners`)
        .on('value', (runnersFirebase) => {
          if (runnersFirebase.val()) {
            const runners = []

            const snap = runnersFirebase.val()

            Object.keys(snap).forEach((key) => {
              snap[key].id = key
              runners.push(snap[key])
            })

            this.runnersFirebase = runners
          }
        })
    },
    components: {
      RemainingTime,
      RaceQuestion
    }
  }
</script>
