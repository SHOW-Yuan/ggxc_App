<template>
	<view class="box">
		
		<view class="title">详情统计表</view>
		
		<!-- 表格 -->
		<view class="my-table">
			<z-table :tableData='baseTableData' :columns='baseColumns' stickSide ></z-table>
		</view>
		
	</view>
</template>

<script>
	import zTable from "@/components/z-table/z-table.vue";
	export default {
		// 在test.vue页面接受参数
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			this.formData.datas[0].date = option.date
			this.datas =JSON.parse(uni.getStorageSync('datas'));
			this.formData.datas[0].uid = this.datas[0].uid;
			this.formData.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
			this.loadData();
		},
		components: {zTable},
		data(){
			return {
				//接口411
				data:[],
				formData: {
				  datas: [{
				    date: "",
					uid:"",
					schoolcode:"",
				  }]
				},
				baseTableData: [],
				baseColumns: [
					{
						title: "姓名",
						key: "name",
						width: 100
					},
					{
						title: "车型",
						key: "vehicletypenumber",
						width: 100
					},
					{
						title: "班别",
						key: "class",
						width: 150
					},
					{
						title: "报名日期",
						key: "applydate",
						width: 200
					},
					{
						title: "费用",
						key: "total",
						width: 100
					},
					{
						title: "缴费日期",
						key: "paytime",
						width: 200
					}
				],
			}
		},
		
		methods: {
			loadData(){
				uni.request({
					url:this.$ip.url.ip1 + '/app/menmian-area/4QAAAAEBAB4/AQYX411',
					method:'post',
					data:JSON.stringify(this.formData),
					success: (res) => {
						let { data: { code, datas, msg } } = res;
						if(code!==200){
							uni.showToast({
								title: msg,
								icon:'none'
							})
							 return;
						}
						this.baseTableData = datas
						console.log(this.baseTableData);
					}
				})
			}
		}
	}
</script>

<style>
	.my-table {
		padding: 0 20upx;
	}
	.title {
		padding: 20upx;
		font-weight: 700;
	}
</style>
