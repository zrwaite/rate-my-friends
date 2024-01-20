export interface PublicUserDoc {
	uid: string
	photoFilename?: string
	firstName?: string
	middleName?: string
	lastName?: string
	nickName?: string
	location?: string
	searchTerms: string[]
	rmf?: boolean
}

export interface ProtectedUserDoc extends PublicUserDoc {
	protected: object
}

export interface UserDoc extends ProtectedUserDoc {
	public: boolean
	private: {
		email: string | null
		authProvider: string
	}
}
