<template>
	<view class="box">
		<!-- 日期区域 -->
		<view class="header-date">
			<view>
				<text @click="shangyue">上一月</text>
				<text>{{ynow}}-{{mnow}}</text>
				<text :class="{isBgc:isBgc}" @click="xiayue">下一月</text>
			</view>
		</view>
		
		<!-- 报名统计表 -->
		<view class="num-table">
			<view class="num-table-tile">考试合格率统计表</view>
			<view class="select-box">
				<view style="width: 50%; margin-right: 10upx;">
					<xfl-select 
					:list="list1"
					:initValue="'C1'"
					:isCanInput="false"  
					:clearable="false"
					:style_Container="listBoxStyle"
					@change="selectChange1"
					>
					</xfl-select>
				</view>
				<view style="width: 50%; margin: auto;">
					<xfl-select 
					:list="list2"
					:initValue="'科目一'"
					:isCanInput="false"  
					:clearable="false"
					:style_Container="listBoxStyle"
					@change="selectChange2"
					>
					</xfl-select>
				</view>
			</view>
		</view>
		
		<!-- 表格 -->
		<view class="my-table">
			<z-table :tableData='baseTableData' :columns='baseColumns' stickSide ></z-table>
		</view>
		
	</view>
</template>


<script>
	import zTable from "@/components/z-table/my-zTable.vue";
	import xflSelect from '@/components/xfl-select/xfl-select.vue';
	export default {
		components: { xflSelect,zTable },
		data(){
			return {
				datas: [],
				//日期
				newDate: '', //当前的日期的信息
				ynow: '', //当前的年数
				mnow: '', //当前的月份
				date1: '', //当前的 2019-6
				isBgc:true,
				formData: {
				  datas: [{
				    date: "",
				    uid: "",
				    schoolcode: "",
				    kskm: "1",
				    kscx: "C1"
				  }]
				},
				listBoxStyle: `height: 70upx;`,
				list1: [	//要展示的数据
					'A1',
					'A2',
					'A3',
					'B1',
					'B2',
					'C1',
					'C2',
					'C5'
				],
				list2: [	//要展示的数据
					'科目一',
					'科目二',
					'科目三',
					'科目四',
				],
				baseTableData: [],
				baseColumns: [
					{
						title: "日期",
						key: "myDate",
						width: 100
					},
					{
						title: "车型",
						key: "kscx",
						width: 100
					},
					{
						title: "科目",
						key: "kskm",
						width: 100
					},
					{
						title: "考试人数",
						key: "examnumber",
						width: 135
					},
					{
						title: "合格人数",
						key: "quanumber",
						width: 135
					},
					{
						title: "合格率",
						key: "pass",
						width: 136
					}
				],
			}
		},
		created() {
		  //日历
		  this.newDate = new Date();
		  this.ynow = this.newDate.getFullYear();
		  let mon = this.newDate.getMonth(); //月份
		  this.mnow = ++mon; //先自增  后赋值
		  if (this.mnow < 10) {
		    this.mnow = '0' + `${this.mnow}`;
		  }
		  this.date1 = `${this.ynow}-${this.mnow}`;
		  /*接口406*/
		  this.datas = JSON.parse(uni.getStorageSync('datas'));
		  this.formData.datas[0].date = this.date1;
		  this.formData.datas[0].uid = this.datas[0].uid;
		  this.formData.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
		  this.formData.datas[0].kskm = "1";
		  this.formData.datas[0].kscx = "C1";
		  this.loadData();
		},
		methods: {
			loadData(){
				uni.request({
					url:this.$ip.url.ip1 + '/app/menmian-area/4QAAAAEBAB4/AQYX409',
					method:'post',
					data:JSON.stringify(this.formData),
					success: (res) => {
						let {data: {code, datas, msg}} = res;
						if(code!==200){
							uni.showToast({
								title: msg,
								icon:'none'
							})
							 return;
						}
						console.log(datas);
						if(datas.length == 0){
							this.loadInfo = {}
							this.baseTableData = []
							return;
						}
						let A1 = 0
						let A2 = 0
						this.baseTableData = datas
						this.baseTableData.map(x=>{
							for (let k in x) {
							    if(x[k] === ''){
									x[k] = ' '
								}
							}
							A1+=x.examnumber
							A2+=x.quanumber
							if(x.kskm == 1){
								x.kskm = '科目一'
							}else if(x.kskm == 2){
								x.kskm = '科目二'
							}
							else if(x.kskm == 3){
								x.kskm = '科目三'
							}
							else if(x.kskm == 4){
								x.kskm = '科目四'
							}
							x.myDate = x.date.substr(x.date.length-2,2)
						})
						let obj = {
							pass:this.Percentage(A2,A1),
							quanumber:A2,
							examnumber:A1,
							kskm:' ',
							kscx:' ',
							myDate:'合计'
						}
						this.baseTableData.push(obj)
					}
				})
			},
			// 下拉框
			selectChange1(e){
				this.formData.datas[0].kscx = e.newVal;
			},
			selectChange2(e){
				this.formData.datas[0].kskm = e.index + 1;
				this.loadData();
			},
			Percentage(num, total) {
			  return (Math.round(num / total * 10000) / 100.00 + "%");// 小数点后两位百分比
			},
			//上一月  下一月
			shangyue() {
			  let date2 = `${this.ynow}-${this.mnow}`; //会变化的日期
			  if (this.mnow > 1) {
			    if (this.mnow <= 10) {
			      this.mnow--;
			      this.mnow = "0" + `${this.mnow}`;
			      date2 = `${this.ynow}-${this.mnow}`;
			    } else if (this.mnow > 10) {
			      this.mnow--;
			      date2 = `${this.ynow}-${this.mnow}`;
			    }
			  } else if (this.mnow <= 1) {
			    if (this.mnow < 10) {
			      this.ynow--;
			      this.mnow = "0" + `${this.mnow}`;
			      this.mnow = 12;
			      date2 = `${this.ynow}-${this.mnow}`;
			    }
			  }
			  this.isBgc = false
			  this.formData.datas[0].date = date2;
			  this.loadData();
			},
			xiayue() {
			  let date2 = `${this.ynow}-${this.mnow}`; //会变化的日期
			  if (date2 !== this.date1) {
			    if (this.mnow < 12) {
			      if (this.mnow < 9) {
			        this.mnow++;
			        this.mnow = "0" + `${this.mnow}`;
			        date2 = `${this.ynow}-${this.mnow}`;
			      } else {
			        this.mnow++;
			        date2 = `${this.ynow}-${this.mnow}`;
			      }
			    } else if (this.mnow >= 12) {
			      this.ynow++;
			      this.mnow = 1;
			      this.mnow = "0" + `${this.mnow}`;
			      date2 = `${this.ynow}-${this.mnow}`;
			    }
			    if (date2 == this.date1) {
			      this.isBgc = true
			    }
			    this.formData.datas[0].date = date2;
			    this.loadData();
			  } else if (date2 == this.date1) {
			    this.isBgc = true
			  }
			  this.formData.datas[0].date = date2;
			  this.loadData();
			},
		}
	}
</script>

<style>
	/* 头部 */
	.header-date {
		font-size: 24upx;
	}
	.header-date>view {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #ECECEC;
		padding: 20upx;
		color: #000000;
	}
	.header-date>view text:nth-child(odd) {
		background-color: rgb(4, 190, 158);
		padding: 8upx 24upx;
		color: #FFFFFF;
	}
	.header-date>view text:nth-child(even) {
		font-weight: 700;
	}
	.num-table {
		padding: 20upx 10upx 0;
		font-size: 24upx;
	}
	.num-table-tile {
		font-size: 36upx;
		font-weight: 700;
	}
	.num-table>view {
		margin-bottom: 20upx;
		text-align: center;
	}
	.num-table>view .people,
	.num-table>view .money {
		font-size: 44upx;
		color: #FEC400;
		font-weight: 700;
		margin-right: 6upx;
	}
	.num-table>view .money {
		color: #00BB99;
	}
	.my-table {
		padding: 0 20upx;
	}
	.isBgc {
		background-color: #bdbdbd!important;
	}
	.z-table-container-row:last-child {
		color: skyblue;
	}
	.select-box {
		display: flex;
		justify-content: center;
		padding: 0 70upx;
	}
</style>
