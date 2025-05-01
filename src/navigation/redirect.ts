export type RedirectOpts = {
	replace?: boolean;
};

export class Redirect {
	public to: string;
	public opts: RedirectOpts | undefined;

	constructor(to: string, opts?: RedirectOpts) {
		this.to = to;
		this.opts = opts;
	}
}
