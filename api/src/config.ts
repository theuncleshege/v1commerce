const config: any = {
    "test": {
        "TEST_FOLDER": "test",
        "APP_SECRET": "ajhr4o5u34802jkasdj"
    },
    "development": {
        "TEST_FOLDER": "/",
        "APP_SECRET": "zxmn495it094lsfdhsdhf"
    }
};

const setConfig = () => {
    const env = process.env.NODE_ENV || 'development';

    if (env === 'development' || env === 'test') {
        Object.keys(config[env]).forEach((key) => {
            process.env[key] = config[env][key];
        });
    }
}

export default setConfig;