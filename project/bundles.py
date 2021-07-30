from flask_assets import Bundle

bundles = {
    'js_base': Bundle(
        'js/base.js', 
        filters='closure_js', 
        output='min/base.js'
    ),
    'js_dashboard': Bundle(
        'js/base.js', 
        'js/dashboard.js', 
        filters='closure_js', 
        output='min/dashboard.js'
    ),
    'js_tos': Bundle(
        'js/base.js', 
        'js/tos.js', 
        filters='closure_js', 
        output='min/tos.js'
    ),
    'js_index': Bundle(
        'js/base.js', 
        'js/index.js', 
        filters='closure_js', 
        output='min/index.js'
    ),
    'js_listings_readonly': Bundle(
        'js/base.js', 
        'js/listings_readonly.js', 
        filters='closure_js', 
        output='min/listings_readonly.js'
    ),
    'js_listings': Bundle(
        'js/base.js', 
        'js/listings.js', 
        filters='closure_js', 
        output='min/listings.js'
    ),
    'js_login': Bundle(
        'js/base.js', 
        'js/login.js', 
        filters='closure_js', 
        output='min/login.js'
    ),
    'js_market_detail': Bundle(
        'js/base.js', 
        'js/market_detail.js', 
        filters='closure_js', 
        output='min/market_detail.js'
    ),
    'js_market': Bundle(
        'js/base.js', 
        'js/market.js', 
        filters='closure_js', 
        output='min/market.js'
    ),
    'js_sell': Bundle(
        'js/base.js', 
        'js/sell.js', 
        filters='closure_js', 
        output='min/sell.js'
    ),
    'js_settings_readonly': Bundle(
        'js/base.js', 
        'js/settings_readonly.js', 
        filters='closure_js', 
        output='min/settings_readonly.js'
    ),
    'js_settings': Bundle(
        'js/base.js', 
        'js/settings.js', 
        filters='closure_js', 
        output='min/settings.js'
    ),
    'js_signup': Bundle(
        'js/base.js', 
        'js/signup.js', 
        filters='closure_js', 
        output='min/signup.js'
    )
}