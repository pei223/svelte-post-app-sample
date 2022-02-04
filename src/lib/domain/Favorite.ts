export type Favorite = {
	title: string;
	author: string;
	authorId: number;
	postId: number;
};

export type FavoriteList = {
	favorites: Favorite[];
	totalPage: number;
};
