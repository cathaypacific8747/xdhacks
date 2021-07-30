from flask_assets import Bundle

bundles = {
    'js_base': Bundle(
        'js/base.js', 
        filters='closure_js', 
        output='js/min/base.js'
    ),
    'js_dashboard': Bundle(
        'js/base.js', 
        'js/dashboard.js', 
        filters='closure_js', 
        output='js/min/dashboard.js'
    ),
    'js_tos': Bundle(
        'js/base.js', 
        'js/tos.js', 
        filters='closure_js', 
        output='js/min/tos.js'
    ),
    'js_index': Bundle(
        'js/base.js', 
        'js/index.js', 
        filters='closure_js', 
        output='js/min/index.js'
    ),
    'js_listings_readonly': Bundle(
        'js/base.js', 
        'js/listings_readonly.js', 
        filters='closure_js', 
        output='js/min/listings_readonly.js'
    ),
    'js_listings': Bundle(
        'js/base.js', 
        'js/listings.js', 
        filters='closure_js', 
        output='js/min/listings.js'
    ),
    'js_login': Bundle(
        'js/base.js', 
        'js/login.js', 
        filters='closure_js', 
        output='js/min/login.js'
    ),
    'js_market_detail': Bundle(
        'js/base.js', 
        'js/market_detail.js', 
        filters='closure_js', 
        output='js/min/market_detail.js'
    ),
    'js_market': Bundle(
        'js/base.js', 
        'js/market.js', 
        filters='closure_js', 
        output='js/min/market.js'
    ),
    'js_sell': Bundle(
        'js/base.js', 
        'js/sell.js', 
        filters='closure_js', 
        output='js/min/sell.js'
    ),
    'js_settings_readonly': Bundle(
        'js/base.js', 
        'js/settings_readonly.js', 
        filters='closure_js', 
        output='js/min/settings_readonly.js'
    ),
    'js_settings': Bundle(
        'js/base.js', 
        'js/settings.js', 
        filters='closure_js', 
        output='js/min/settings.js'
    ),
    'js_signup': Bundle(
        'js/base.js', 
        'js/signup.js', 
        filters='closure_js', 
        output='js/min/signup.js'
    ),
    'css_base': Bundle(
        'css/base.css',
        filters='cssmin',
        output='css/min/base.css'
    ),
    'css_dashboard': Bundle(
        'css/base.css',
        'css/dashboard.css',
        filters='cssmin',
        output='css/min/dashboard.css'
    ),
    'css_index': Bundle(
        'css/base.css',
        'css/index.css',
        filters='cssmin',
        output='css/min/index.css'
    ),
    'css_listings_readonly': Bundle(
        'css/base.css',
        'css/listings_readonly.css',
        filters='cssmin',
        output='css/min/listings_readonly.css'
    ),
    'css_listings': Bundle(
        'css/base.css',
        'css/listings.css',
        filters='cssmin',
        output='css/min/listings.css'
    ),
    'css_market_detail': Bundle(
        'css/base.css',
        'css/market_detail.css',
        filters='cssmin',
        output='css/min/market_detail.css'
    ),
    'css_market': Bundle(
        'css/base.css',
        'css/market.css',
        filters='cssmin',
        output='css/min/market.css'
    ),
    'css_sell': Bundle(
        'css/base.css',
        'css/sell.css',
        filters='cssmin',
        output='css/min/sell.css'
    ),
    'css_settings_readonly': Bundle(
        'css/base.css',
        'css/settings_readonly.css',
        filters='cssmin',
        output='css/min/settings_readonly.css'
    ),
    'css_settings': Bundle(
        'css/base.css',
        'css/settings.css',
        filters='cssmin',
        output='css/min/settings.css'
    ),
    'css_signinButton': Bundle(
        'css/base.css',
        'css/signinButton.css',
        filters='cssmin',
        output='css/min/signinButton.css'
    ),
    'css_tos': Bundle(
        'css/base.css',
        'css/tos.css',
        filters='cssmin',
        output='css/min/tos.css'
    )
}