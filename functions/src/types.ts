export type Context =
	| {
			auth?: {
				uid: string;
				token?: {
					admin?: boolean;
					email?: string;
				};
			};
	  }
	| undefined;
