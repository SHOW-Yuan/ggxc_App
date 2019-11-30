<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	.status_bar {
	    height: var(--status-bar-height);  
	    width: 100%;  
	    background-color: #FFFFFF;  
	}  
	.top_view {  
	    height: var(--status-bar-height);  
	    width: 100%;  
	    position: fixed;  
	    background-color: #FFFFFF;  
	    top: 0;  
	    z-index: 999;  
	}
</style>
