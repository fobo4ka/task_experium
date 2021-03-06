app.controller('MainController', ['$scope', function ($scope) {

    $scope.products = [];
    $scope.emptyCart = true;
    $scope.discountApplied = false;

    $scope.addProduct = function () {
        if (($scope.name != "") && ($scope.price != "") && !isNaN($scope.price) && ($scope.price > 0)) {

            $scope.products.push({
                name: $scope.name,
                price: $scope.price,
                priceWithDiscount: ''
            });

            $scope.emptyCart = false;
            $scope.error = false;
            recalculateDiscount();
        } else {
            $scope.error = true;
        }
        $scope.name = '';
        $scope.price = '';
    };

    function recalculateDiscount() {
        var commonCost = 0;
        var maxPrice = 0;
        var commonDiscount = 0;
        var numMax = 0;
        var discount = parseInt($scope.discount) || 0;
        $scope.discount = discount;

        angular.forEach($scope.products, function (product) {
            var price = parseInt(product.price);

            if (price > maxPrice) {
                maxPrice = price;
            }
            commonCost += price;
        });

        angular.forEach($scope.products, function (product) {
            var price = parseInt(product.price);

            if (price != maxPrice) {
                var priceWithDiscount = Math.ceil(price - price / (commonCost / discount));

                product.priceWithDiscount = (priceWithDiscount >= 0 ? priceWithDiscount : 0);
                commonDiscount += price - product.priceWithDiscount;
            } else {
                numMax++;
            }
        });

        var i = 0;

        angular.forEach($scope.products, function (product) {
            var price = parseInt(product.price);
            var priceWithDiscount = 0;

            if (price == maxPrice) {
                i++;
                if (i != numMax) {
                    priceWithDiscount = Math.ceil(price - (discount - commonDiscount) / numMax);
                    product.priceWithDiscount = (priceWithDiscount >= 0 ? priceWithDiscount : 0);
                    commonDiscount += price - priceWithDiscount;
                } else {
                    priceWithDiscount = price - (discount - commonDiscount);
                    product.priceWithDiscount = (priceWithDiscount >= 0 ? priceWithDiscount : 0);
                }
            }
        });
    }

    $scope.addDiscount = function () {
        recalculateDiscount();
        $scope.discountApplied = true;
    }
}]);