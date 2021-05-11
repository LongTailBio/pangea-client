

export interface WikiPageType {
	uuid: string;
	title: string;
	text: string;
  	created_at: string;
  	updated_at: string;
}


export interface WikiType {
	uuid: string;
	home_page_obj: WikiPageType;
	sidebar_obj: WikiPageType;
	page_objs: WikiPageType[];
    created_at: string;
    updated_at: string;
}

export interface SampleGroupWikiType {
	sample_group: string;
	wiki: string;
	wiki_obj: WikiType;
	created_at: string;
  	updated_at: string;
}