<template>
  <r-page>
      <top title="实习表现" :showBack="true"/>
      <r-body>

          <r-card title="实习表现">
                <div id="daysStr" ></div>
                <div id="perform" style="width: 100%;height:265px;"></div>
            </r-card>
            
           <r-card title="导员考核">
                  <r-input title="实习出勤分:" :readonly="true"  :max="100" :min="0"  :model="this" value="v_score_1" :isNumber="true"/>
                  <r-input title="实习材料分:" :readonly="true"  :max="100" :min="0"  :model="this" value="v_score_2" :isNumber="true"/>
                  <r-textarea title="评价:" :readonly="true" :model="this" value="comments" :height="150" :max="600"></r-textarea>
            </r-card>
           <!--  <r-card title="出勤记录表现">
                  <div id="record" style="width: 100%;height:270px;"></div>
            </r-card> -->
            
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

                    let dayStr1 = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#CA8EFF">出勤天数: ' + temp_attend.body.attendaceDays + '天；</font><font color="#7D7DFF">病假天数: ' +  temp_attend.body.sickLeaveDays + '天；</font>';
                    let dayStr2 = '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="#66B3FF">事假天数: ' + temp_attend.body.personalDays + '天；</font><font color="#0072E3">旷工天数: ' + temp_attend.body.absenteeismDays + '天；</font>';
                    document.getElementById('daysStr').innerHTML =  dayStr1 + dayStr2;
                }
        }

        // 开始生成出勤饼图
          const perform = echarts.init(document.getElementById('perform'));
          const performOption = {
                title : {  
                    text: '实习表现',  
                    subtext: '',  
                    x:'left',  
                    textStyle:{  
                        color:"#222",                             
                        fontStyle:"normal",                      
                        fontWeight:"600",  
                        fontFamily:"san-serif",  
                        fontSize:16,     
                    }  
                },  
                tooltip : {  
                    trigger: 'item',                        
                  formatter: "{a} {b} : ({c}天) {d}%"  
                },  
                legend: {  
                    x : '70%',  
                        y : '25%',  
                    orient: 'vertical',  
                    left: 'left',  
                    itemWidth:10,  
                    itemHeight:10,  
                    selectedMode:false, //禁止点击  
                    textStyle: {    
                                fontSize: 12 ,  
                                color:"#999",    
                             },   
                    formatter: function (name) {  
                                   return name.length > 4 ? (name.slice(0,4)+"...") : name                                        
                        },  
                    data:['出勤天数','病假天数','事假天数','旷工天数']
                },  
                series : [  
                    {  
                        name: '',  
                        type: 'pie',  
                        radius : '50%',  // '75%'饼状   ['40%', '70%']环状
                        center: ['50%', '40%'],  
                        hoverAnimation:false, //是否开启 hover 在扇区上的放大动画效果  
                        selectedMode:'single',  //选中模式，表示是否支持多个选中，默认关闭，支持布尔值和字符串，字符串取值可选'single'，'multiple'，分别表示单选还是多选。  
                        selectedOffset:5, //选中扇区的偏移距离  
                        data:[
                            {value:this.performInfo.attendaceDays, name:'出勤天数'},
                            {value:this.performInfo.sickLeaveDays, name:'病假天数'},
                            {value:this.performInfo.personalDays, name:'事假天数'},
                            {value:this.performInfo.absenteeismDays, name:'旷工天数'}
                        ],
                        itemStyle: {  
                            normal:{  
                                label:{  
                                    show:true,  
                                   formatter: function(params){  
                                           var name=params.name; //名字  
                                           var percent=params.percent; //占比  
                                           var value=params.value; //数量  
                                           if(name.length>8){  
                                                return name.slice(0,7)+"..."+"\n"+"("+value+"天)"+percent+"%";  
                                           }else{  
                                                return name+"\n"+"("+value+"天)"+percent+"%";  
                                           }  
                                   }                                     
                                  },  
                                 labelLine:{  
                                    show:true  
                                  }  
                                },  
                            emphasis: {  
                                shadowBlur: 10,  
                                shadowOffsetX: 0,  
                                shadowColor: 'rgba(0, 0, 0, 0.5)'  
                            }  
                        }  
                    }  
                ],  

               color: ['rgb(187,140,238)','rgb(134,146,243)','rgb(60,184,255)','rgb(113,171,246)','rgb(255,193,134)']  
            };
            
            perform.setOption(performOption);



        
  }
 
};
</script>


