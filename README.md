MyIcons
=======

links: [homepage](http://io-meter.com/myicons), [screenshots](http://io-meter.com/myicons/#screenshots)

Yes, this is yet another web icon font builder. But it's also designed to be your
or your team's flat icons manager with enhanced team member management and
revisions tracking. It is also very easy to deploy.

The main idea of this web-based application is:

1. At first you upload font files (.tff or .woff) with the corresponding CSS.
The application will retrieve the shapes and names of icons and build them into a **pack**.
2. Then you add a new **collection** to organize the icons. You can pick icons from a pack
or upload a SVG icon file directly.
3. After added icons to a collection, you can preview the icons in your own web pages
with **live testing**. **Live testing** provides a URL to testing CSS that you can insert
into your page when debuging
4. At last, when you are satisfied with the icons' appearance, you can download the
icon fonts built and replace the live testing url.

There are **nine** build-in smart labels which classify the icons automatically
immediately after uploaded. 

This web app can be deployed to heroku in 3 minutes. Go to [Get Started](#get-started)

## Compatibility

Both this application and the icon fonts it builds has been tested under IE11+, Chrome,
Firefox and Safari. IE6-IE8 are **NOT** supported by now.

If you meet any compatibility problems under IE11+, Chrome, Firefox and Safari, please report a issue.

## Known issues and possible improvements

1. Some public web icon fonts can not be uploaded (incompatible with the app's parser).
2. No webhooks supported so that you can not integrate it with slack or other services (feature in plan).
3. Modification of the shape of icons is not supported (feature in plan).

Pull request is welcome. Also feel free to report a issue or request a feature, but don't
forget to support by [donation](http://io-meter.com/myicons/#donate).

# Get started

The simplest way to get started is to deploy this app to [heroku](http://heroku.com).
It will be same simple if you have a heroku-like enviroment such as [dokku](https://github.com/progrium/dokku)
and [deis](http://deis.io/). You can also deploy it on you own Linux server with just a few more steps.

## Deploy to heroku in 3 minutes

Before deploying to heroku, please make sure you have already had a heroku account and 
the [heroku cli tools](https://devcenter.heroku.com/articles/heroku-command) has been installed.

At first, clone this repo with git:
```
git clone https://github.com/shanzi/myicons.git
```

Then `cd myicons` and configure your local settings:
```
cp myicons/local_settings.py.example myicons/local_settings.py
```

The default contents of `myicons/local_settings.py` is OK with heroku, but **DON'T forget**
to replace the value of `SECRET_KEY` with a new generated key!

Before commit, you have to remove `local_settings.py` from `.gitignore`:

```
sed -i '' /local_settings.py/d .gitignore
git add .
git ci -m'add local settings'
```

Now you can start deploying to heroku, please use the [build pack](https://github.com/shanzi/heroku-buildpack-python)
I forked for this app, replace `[your app name]` with your desired app name:

```
heroku create [your app name] -s cedar-14 -b https://github.com/shanzi/heroku-buildpack-python.git
git push heroku master
```

Then the heroku will start building the app. After all done, init your database and super user:

```
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

Fill in your super user's information according to the prompt's instructions.

At last, start your web process and start using MyIcons!

```
heroku scale web=1
heroku open
```

## Deploy to dokku/deis

Dokku and deis are two of heroku-like systems you can use on your own server or VPS.
They are compitible to heroku's build packs, so with the [build pack](https://github.com/shanzi/heroku-buildpack-python)
prepared for this app, there won't be any significant differences with deploying to heroku.

In case you'd like to use MySQL/MariaDB instead of PostgreSQL(which is heroku's default database), 
you can modify `requirements.txt` and replace `psycopg2` with
[MySQLdb](https://pypi.python.org/pypi/MySQL-python/1.2.4),
Please refer to [django's documentation for using with MySQL](https://docs.djangoproject.com/en/1.7/ref/databases/#mysql-db-api-drivers).

## Deploy to your own server

Deploying MyIcons to your own server is a little complex because of the dependency of
[fontforge](http://fontforge.github.io). You have to install `python-fontforge` with your linux distribution's
packages manager. For example, under Ubuntu 14.04, you run

```
apt-get install python-fontforge
```

Please refer to fontforge's [instruction](http://fontforge.github.io/en-US/downloads/gnulinux/).

If you'd like to use the system's python environment, what you do next is just install the dependencies of MyIcons
by execute:

```
pip install -r requirements.txt
```

And then initialize the database like that has described for heroku. You also have to configure databases yourself.
All database compitible with django is OK for MyIcons. You may need refer to
[dj-database-url](https://github.com/kennethreitz/dj-database-url).

Fontforge's python extension (which is needed by MyIcons) doesn't works well with `virtualenv`,
So it is recommended that you use [docker](https://www.docker.com) for enviroment separation.

The official docker image for MyIcons is in future's plan.

# About the author

I regard myself as an indie web and Mac developer.
You can find me at [twitter](https://twitter.com/ant_sz).
I am still a student at SJTU, so don't forget to [donate](http://io-meter.com/myicons/#donate)
to support the development of this application. :)

# Donation

You can support the development of MyIcons by donation with [Gratipay](https://gratipay.com/shanzi/)
or [Paypal](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=yun%2eer%2erun%40gmail%2ecom&lc=US&item_name=myicons&no_note=0&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHostedGuest).

Note that the tips on gratipay will recur every week by default so you should keep an eye on it if you'd like
to stop giving tips someday.

As for paypal, it will charge a lot on the donation itself, so please don't donate too little.

# License

This application itself is released under **BSD** license, see [LICENSE](./LICENSE).

All 3rd party open sourced libs distributed with this application are still under their own license.
