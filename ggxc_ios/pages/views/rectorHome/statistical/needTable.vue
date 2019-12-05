<template>
	<view class="box">
		
		<!-- 报名统计表 -->
		<view class="num-table">
			<view class="num-table-tile">待考统计表</view>
		</view>
		
		<!-- 表格 -->
		<view class="my-table">
			<z-table :tableData='baseTableData' :columns='baseColumns' stickSide showBottomSum></z-table>
		</view>
		
	</view>
</template>


<script>
	import zTable from "@/components/z-table/my-zTable.vue";
	export default {
		components: {zTable},
		data(){
			return {
				datas: [],
				//日期
				newDate: '', //当前的日期的信息
				ynow: '', //当前的年数
				mnow: '', //当前的月份
				date1: '', //当前的 2019-6
				isBgc:true,
				formData: { // 请求数据
				  datas: [{
				    date: "",
				    uid: "",
				    schoolcode: "",
				  }]
				},
				loadInfo:{},
				loadList:[],
				baseTableData: [
					
				],
				baseColumns: [
					{
						title: "车型",
						key: "kscx",
						width: 100
					},
					{
						title: "科目一",
						key: "km1",
						width: 120
					},
					{
						title: "科目二",
						key: "km2",
						width: 120
					},
					{
						title: "科目三",
						key: "km3",
						width: 120
					},
					{
						title: "科目四",
						key: "km4",
						width: 120
					},
					{
						title: "待考总人数",
						key: "number",
						width: 160
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
		  this.loadData();
		},
		methods: {
			loadData(){
				uni.request({
					url:this.$ip.url.ip1 + '/app/menmian-area/4QAAAAEBAB4/AQYX410',
					method:'post',
					data:JSON.stringify(this.formData),
					success: (res) => {
						let {data: {code,datas,msg}} = res;
						if(code!==200){
							uni.showToast({
								title: msg,
								icon:'none'
							})
							 return;
						}
						if(datas.length == 0){
							this.baseTableData = []
							return;
						}
						this.baseTableData = datas
						this.baseTableData.map(x=>{
							for (let k in x) {
							    if(x[k] === ''){
									x[k] = ' '
								}
							}
						})
						console.log(this.baseTableData);
					}
				})
			}
		}
	}
</script>

<style>
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
</style>
