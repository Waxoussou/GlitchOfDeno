
export default async ({ response }, next) => {
    try {
        await next();
    } catch (err) {
        console.error(err)
        response.status = 500;
        response.body = { msg: err.message };
    }
};
