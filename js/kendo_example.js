var items = new kendo.data.DataSource({
    schema:
    {
        model: {}
    },
    transport:
    {
        read:
        {
            url: "/Kendo_UI_Example/data/items.json",
            dataType: "json"
        }
    }
});

var cart = kendo.observable({
    contents: [],
    cleared: false,

    contentsCount: function () {
        return this.get("contents").length;
    },

    add: function (item) {
        var found = false;

        this.set("cleared", false);

        for (var i = 0; i < this.contents.length; i++) {
            var current = this.contents[i];
            if (current.item === item) {
                current.set("quantity", current.get("quantity") + 1);
                found = true;
                break;
            }
        }

        if (!found) {
            this.contents.push({ item: item, quantity: 1 });
        }
    },

    empty: function () {
        var contents = this.get("contents");
        contents.splice(0, contents.length);
    },

    clear: function () {
        var contents = this.get("contents");
        contents.splice(0, contents.length);
        this.set("cleared", true);
    },

    total: function () {
        var price = 0,
            contents = this.get("contents"),
            length = contents.length,
            i = 0;

        for (; i < length; i++) {
            price += parseInt(contents[i].item.Price) * contents[i].quantity;
        }

        return kendo.format("{0:c}", price);
    }
});

var layoutModel = kendo.observable({
    cart: cart
});

var cartPreviewModel = kendo.observable({
    cart: cart,

    emptyCart: function () {
        cart.empty();
    },

    itemPrice: function (cartItem) {
        return kendo.format("{0:c}", cartItem.item.Price);
    },

    totalPrice: function () {
        return this.get("cart").total();
    },

    proceed: function (e) {
        this.get("cart").clear();
        kendo_example.navigate("/");
    }
});

var indexModel = kendo.observable({
    items: items,
    filterable: true,
    cart: cart,

    addToCart: function (e) {
        cart.add(e.data);
    },


});

var viewModel = kendo.observable({
    searchValue: "",
    filterList: function (e) {
        var searchBoxValue = $('#searchBox').val();
        $("#main").data("kendoListView").dataSource.filter({
            logic: "or",
            filters: [
                {
                    field: "Id",
                    operator: "contains",
                    value: searchBoxValue
                },
                {
                    field: "Name",
                    operator: "contains",
                    value: searchBoxValue
                },
                {
                    field: "Category",
                    operator: "contains",
                    value: searchBoxValue
                }
            ]
        });
    }
});

// Views and layouts
var layout = new kendo.Layout("layout-template", { model: layoutModel });
var index = new kendo.View("index-template", { model: indexModel });
var checkout = new kendo.View("checkout-template", { model: cartPreviewModel });
var search = new kendo.View("search-box-template", { model: viewModel });

kendo.bind($("#search-box-template"), viewModel);

var kendo_example = new kendo.Router({
    init: function () {
        layout.render("#application");
    }
});

// Routing
kendo_example.route("/", function () {
    viewingDetail = false;
    layout.showIn("#content", index);
    layout.showIn("#search-bar", search);
});

kendo_example.route("/checkout", function () {
    viewingDetail = false;
    layout.showIn("#content", checkout);
    search.hide();
});

$(function () {
    kendo_example.start();
});
