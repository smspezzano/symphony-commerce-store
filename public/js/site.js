// GOALS:
// Retreive,
// display: image, name, price
// sort create date price
// mock sevice to update producst price in bulk (-25%) (click a button to trigger)

$( document ).ready(function(){
	// add http://cors.io/ to bypass CORS
	// TODO: update workaround before releasing 
	var url = "http://cors.io/?u=http://sneakpeeq-sites.s3.amazonaws.com/interviews/ce/feeds/store.js"

	var productBodyClass = ".product__tbody"

	var parsedProducts = []

	function addProductsToPage (products){
		// empty contents before loading
		$(productBodyClass).empty()
		for (var i = 0; i < products.length; i++){
			var currentProduct = products[i]
			var productTr = "<tr><td><image class='products__image' src=" + currentProduct.image + "></td><td>" + currentProduct.name + "</td><td> $" + currentProduct.price + "</td></tr>"
			$(productBodyClass).append(productTr)
		}		
	};

	function productData(image, name, price){
		this.image = image;
		this.name = name;
		this.price = parseFloat((price/100).toFixed(2));
	};

	function parseData(data){
		// extract needed information from data
		var products = data.products;
		for (var i=0; i < products.length; i++){
			currentProduct = products[i];
			var tempProduct = new productData(
					currentProduct.mainImage.ref,
					currentProduct.name,
					currentProduct.maxPrice
				)
			parsedProducts.push(tempProduct)
		}
		return addProductsToPage(parsedProducts)
	};



	function getContent (){
		$.ajax({
			url: url,
			dataType: "json",
			method: "GET",
		}).done(function(data){
			parseData(data)
		}).fail(function(jqXHR, textStatus ) {
		  console.log( "Request failed: " + textStatus );
		});
	};

	// instantiate get call
	getContent()

	function reducePrice(amountToReduceBy){
		// reduce price for all products by the passed in amount
		// update the object inside parsedProducts
		// pass the updated products to addProductsToPage() so updated prices show up
		for (var i=0; i < parsedProducts.length; i++){
			var currentProductPrice = parsedProducts[i].price
			var reduceAmount = (currentProductPrice * amountToReduceBy).toFixed(2)
			var newPrice = parseFloat((currentProductPrice - reduceAmount).toFixed(2))
			parsedProducts[i].price = newPrice
		}
		addProductsToPage(parsedProducts)
		// show alert that prices are being udpated
		var $alertHeader = $('.alert-header');
		$alertHeader.text('Price Updated')
		$alertHeader.fadeIn(1000, function(){
			$alertHeader.fadeOut(1000)
		})	
	};

	// watcher for price reduction request 
	$('.reduce_price').on('click', function(e){
		return reducePrice(parseFloat(e.currentTarget.dataset.amount))
	});

});