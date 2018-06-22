<template>
  <r-page>
      <top title="实习表现" :showBack="true"/>
      <r-body>
           <r-card title="实习评价">
                  <r-input title="实习出勤分:" :readonly="true"  :max="100" :min="0"  :model="this" value="v_score_1" :isNumber="true"/>
                  <r-input title="实习材料分:" :readonly="true"  :max="100" :min="0"  :model="this" value="v_score_2" :isNumber="true"/>
                  <r-textarea title="评价:" :readonly="true" :model="this" value="comments" :height="150" :max="600"></r-textarea>
            </r-card>
           <!--  <r-card title="出勤记录表现">
                  <div id="record" style="width: 100%;height:270px;"></div>
            </r-card> -->
            <r-card title="实习表现">
                  <div id="perform" style="width: 100%;height:265px;"></div>
            </r-card>
      </r-body>
           
          
  </r-page>
</template>

<script>
export default {
  data(){
      return {
          comments:null,
          v_score_1:null,
          v_score_2:null,
          v_studentNo:null,
          performInfo: {}
      }
  },
  async mounted (){
       /*  const myChart = echarts.init(document.getElementById('record'));
        const option = {
            title: {
                text: '出勤记录表现'
            },
            tooltip: {},
            legend: {
                data:['表现']
            },
            xAxis: {
                data: ["病假","事假","出勤","矿工"]
            },
            yAxis: {},
            series: [{
                name: '表现',
                type: 'bar',
                data: [5, 20, 36, 10]
            }]
        };
        myChart.setOption(option); */

        const url = "intern/attendenceAppraisal/stu";
        const temp_record = await this.$http.get(url);
        if(temp_record.body){
            this.comments = temp_record.body.comments;
            this.v_score_1 = temp_record.body.attendanceScore;
            this.v_score_2 = temp_record.body.documentScore;
            this.v_studentNo = temp_record.body.studentNo;
        }

        // 获取生成出勤饼图的数据
        if(this.v_studentNo !== 'null'){
                const url = "intern/summary/student/attendence?studentNo=" + this.v_studentNo;
                const temp_attend = await this.$http.get(url);
                if(temp_attend.body){
                    const performInfoTemp = {};
                    performInfoTemp['attendaceDays']= temp_attend.body.attendaceDays;
                    performInfoTemp['sickLeaveDays'] = temp_attend.body.sickLeaveDays;
                    performInfoTemp['personalDays'] = temp_attend.body.personalDays;
                    performInfoTemp['absenteeismDays'] = temp_attend.body.absenteeismDays;

                    this.performInfo = performInfoTemp;
                }
        }

        // 开始生成出勤饼图
        const perform = echarts.init(document.getElementById('perform'));
        const performOption = {
              tooltip: {
                  trigger: 'item',
                  formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                  orient: 'vertical',
                  x: 'left',
                  data:['出勤天数','病假天数','事假天数','旷工天数']
              },
              series: [
                  {
                      name:'实习表现',
                      type:'pie',
                      radius: ['50%', '70%'],
                      avoidLabelOverlap: false,
                      label: {
                          normal: {
                              show: false,
                              position: 'center'
                          },
                          emphasis: {
                              show: true,
                              textStyle: {
                                  fontSize: '30',
                                  fontWeight: 'bold'
                              }
                          }
                      },
                      labelLine: {
                          normal: {
                              show: false
                          }
                      },
                      data:[
                          {value:this.performInfo.attendaceDays, name:'出勤天数'},
                          {value:this.performInfo.sickLeaveDays, name:'病假天数'},
                          {value:this.performInfo.personalDays, name:'事假天数'},
                          {value:this.performInfo.absenteeismDays, name:'旷工天数'}
                      ]
                  }
              ]
        };

        perform.setOption(performOption);

        
  }
 
};
</script>


