<template>
  <r-page>
      <top title="记录评价" :showBack="true"/>
      <r-body>
          <r-card>
                  <r-input title="分数" :model="this" value="name"/>
                  <r-textarea placeholder="实习评价" :model="this" value="name"  :autoSize="true" :height="400" :max="400"></r-textarea>
          </r-card>
      </r-body>
              <r-tab-bar>
                <r-cell type="row" :vertical="true">
                              <r-cell >
                                  <r-box>
                                      <r-button >提交</r-button>
                                  </r-box>
                              </r-cell>
                  </r-cell>
            </r-tab-bar>
  </r-page>
</template>

<script>
export default {
  data() {
    return {
      startDate:null,
      endDate:null,
      type:null,
      value:null,
      options:[{"key":"sj","value":"事假"},{"key":"bj","value":"病假"}]
    };
  },
  methods :{
    onChange(){

    }
  }
};
</script>


