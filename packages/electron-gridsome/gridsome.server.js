// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = function (api) {
	api.loadSource(({ addCollection }) => {
		// Use the Data Store API here: https://gridsome.org/docs/data-store-api/
		// const data = await axios.get('http://localhost:4001');
		// Use the Data Store API here: https://gridsome.org/docs/data-store-api/
		const data = axios({
			url: 'http://localhost:4001',
			method: 'post',
			data: {
			  query: `
				query {
					cwd
				}
				`
			}
		  }).then((result) => {
			console.log(result.data)
		  });

		  console.log(data);

	});

	api.createPages(({ createPage }) => {
		// Use the Pages API here: https://gridsome.org/docs/pages-api/
	});
};
