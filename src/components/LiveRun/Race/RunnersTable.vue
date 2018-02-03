<template>

    <v-table
            :width="1200"
            :columns="columns"
            :table-data="tableData"
            :show-vertical-border="true"
            :odd-bg-color = "'#cfe2f3'"
            :title-row-height ="50"
            :border="1"
    ></v-table>
</template>

<script>
import 'vue-easytable/libs/themes-base/index.css'
import {VTable,VPagination} from 'vue-easytable'
import Vue from "vue"
Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)

import { mapGetters } from 'vuex'
import { db } from '../../../firebase'
export default {
  name: 'runners-table',
  computed: mapGetters({
    runners: 'Race/runners',
    race: 'Race/race',
  }),
  data: () => ({
    tableData: [],
    columns: [],
    firbaseRunners:{},
    oldPosition:null
  }),
  watch: {
    runners(){
      var activeRunners = []
      var status 
      db.ref(`/racers/${this.$route.params.raceId}`).on('value', (race)=>{
        if(race.val()){
        this.status = race.val().status
        }
      })
      if(this.status === 'started' || this.status === 'running' || this.status === 'finished'){
              db.ref(`/racers/${this.$route.params.raceId}/runners`)
                .on('value', (runnersFirebase) => {
                  if (runnersFirebase.val()) {
                    this.firbaseRunners = runnersFirebase.val()
                  }
                })

              let _this = this
              this.runners.forEach(function(runner,index) { 
                      for (const [key, firbaseRunner] of Object.entries( _this.firbaseRunners)) {
                          if(runner.id == key){

                            //Get Pace
                            var distance = (firbaseRunner.distance/1000).toFixed(2)
                            var duration = _this.race.duration
                            var pace = distance/duration

                            //Get Rank
                            var position = firbaseRunner.position
                            var newPosition = _this.oldPosition-position
                            _this.oldPosition = position
                                  
                                  runner.distance = distance
                                  runner.name = firbaseRunner.name  
                                  runner.isRunning = firbaseRunner.isRunning
                                  runner.position = newPosition                                 
                                  runner.time = firbaseRunner.time
                                  runner.pace = pace  
                                  runner.rank = firbaseRunner.position
                                  runner.dummy = 0

                          }                 
                        }  
                  activeRunners.push(runner)
              })  
          
              activeRunners.sort(function(a, b){
                  return b.distance-a.distance
              })

      }else {
        this.runners.forEach(function(runner,index) { 
                     
                                  runner.distance = ''
                                  runner.isRunning = ''
                                  runner.position = ''                                 
                                  runner.time = ''
                                  runner.pace = ''
                                  runner.dummy = ''

                        
                  activeRunners.push(runner)
              })  
      }
      this.tableData = activeRunners
      this.columns = [
                {field: "rank", title:'Rank', width: 50, titleAlign: 'center',columnAlign:'center'},
                {field: "firstName", title:'Runner Name', width: 95, titleAlign: 'center',columnAlign:'center'},
                {field: "id", title:'ID', width: 50, titleAlign: 'center',columnAlign:'center'},
                {field: "lastName", title:'Location', width: 90, titleAlign: 'center',columnAlign:'center'},
                {field: "distance", title:'distance/KM', width: 90, titleAlign: 'center',columnAlign:'center'},
                {field: "pace", title:'Current Pace(min/km)', width: 90, titleAlign: 'center',columnAlign:'center'},
                {field: "dummy", title:'Altitude Change last 5 min(m)', width: 115, titleAlign: 'center',columnAlign:'center'},
                {field: "position", title:'Change in Rank last 5 min', width: 110, titleAlign: 'center',columnAlign:'center'},
                {field: "dummy", title:'# of Completed LiveRuns', width: 110, titleAlign: 'center',columnAlign:'center'},
                {field: "dummy", title:'Total LiveRuns ran(km)', width: 100, titleAlign: 'center',columnAlign:'center'},
                {field: "dummy", title:'Last Run', width: 80, titleAlign: 'center',columnAlign:'center'},
                {field: "dummy", title:'Days since last LiveRuns', width: 110, titleAlign: 'center',columnAlign:'center'},
                {field: "dummy", title:'Questionaire', width: 110, titleAlign: 'center',columnAlign:'center'}
              ]
      }
  }
}
</script>
