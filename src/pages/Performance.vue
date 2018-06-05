<template>
  <r-page>
      <top title="实习表现" :showBack="true"/>
      <r-body>
           <r-card title="实习评价">
                  <r-input title="分数:" :readonly="true"  :max="100" :min="0"  :model="this" value="v_score" :isNumber="true"/>
                  <r-textarea title="评价:" :readonly="true" :model="this" value="comments" :height="300" :max="600"></r-textarea>
            </r-card>
            <r-card title="实习表现">
                  <div id="ill" style="width: 100%;height:270px;"></div>
            </r-card>
            <r-card title="记录表现">
                  <div id="record" style="width: 100%;height:270px;"></div>
            </r-card>
      </r-body>
           
          
  </r-page>
</template>

<script>
export default {
  data(){
      return {
          comments:null,
          v_score:null
      }
  },
  async mounted (){
        const myChart = echarts.init(document.getElementById('ill'));
        const option = {
            title: {
                text: '实习表现'
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
        myChart.setOption(option);
        const record = echarts.init(document.getElementById('record'));
        const recordOption = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['优秀','良好','一般','较差','差']
    },
    series: [
        {
            name:'记录表现',
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
                {value:335, name:'优秀'},
                {value:310, name:'良好'},
                {value:234, name:'一般'},
                {value:135, name:'较差'},
                {value:1548, name:'差'}
            ]
        }
    ]
};

        record.setOption(recordOption);
          const url = "intern/attendenceAppraisal/stu";
                  const temp_record = await this.$http.get(url);
                  if(temp_record.body){
                    this.comments = temp_record.body.comments;
                    this.v_score = temp_record.body.score;
                  }
  }
 
};
</script>


