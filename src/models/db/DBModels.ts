/**
 * @description A collection of all the models of tables in the database. This
 * file contains all database models, therefore a bit long. Ctrl-F and 
 * Ctrl-K -> (0|J) are your friends. The database models need to be defined in
 * the order below because some need others to be defined beforehand. That's
 * why we can't arrange the declarations, say alphabetically.
 * 
 * Initially, we used MongoDB for the database because the data was mostly
 * self-contained (and I fell for the 'schemaless' fallacy[1]). However, as the
 * application got more features, a relational database seemed proper - I found
 * myself dabbling too much with denormalized data.
 * 
 * [1] To borrow from Martin Kleppmann: 
 * 
 * > Schema-on-read is similar to dynamic (runtime) type checking in programming
 * > languages, whereas schema-on-write is similar to static (compile-time) type
 * > checking.
 * 
 * @module
 */

import { 
    Sequelize, Model, DataTypes, HasOneGetAssociationMixin, 
    BelongsToGetAssociationMixin, HasManyGetAssociationsMixin, 
    BelongsToManyGetAssociationsMixin, HasManySetAssociationsMixin, 
    HasManyAddAssociationMixin, HasOneSetAssociationMixin, 
    HasOneCreateAssociationMixin, BelongsToSetAssociationMixin 
} from "sequelize";

import { DATABASE_URI } from "../../config";
import { getRandomString, ALPHANUMERICS } from "../Utils";

export const sequelize = new Sequelize(DATABASE_URI);

export class User extends Model {
    /** An identifier of this user instance. */
    readonly id!: string;

    /** 
     * A unique alphanumeric username. Chosen by the user on account creation.
     * Stored as lower case.
     */
    userName!: string;

    /** 
     * The email address associated with this user's account. Stored as
     * lower-case.
     */
    emailAddress!: string;

    /** `true` iff this user has validated their account. */
    hasValidatedAccount!: boolean;

    createdAt!: Date;
    updatedAt!: Date;

    getUserAuthenticationData!: HasOneGetAssociationMixin<UserAuthenticationData>;
    createUserAuthenticationData!: HasOneCreateAssociationMixin<UserAuthenticationData>;
    setUserAuthenticationData!: HasOneSetAssociationMixin<UserAuthenticationData, UserAuthenticationData>;
    
    getUserPrefences!: HasOneGetAssociationMixin<UserPrefences>;
    createUserPreferences!: HasOneCreateAssociationMixin<UserPrefences>;
    setUserPreferences!: HasOneSetAssociationMixin<UserPrefences, UserPrefences>;

    getReviewStreak!: HasOneGetAssociationMixin<ReviewStreak>;
    createReviewStreak!: HasOneCreateAssociationMixin<ReviewStreak>;

};
User.init({

    id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(val: string) {
            this.setDataValue('userName', val.toLowerCase());
        },
        validate: {
            is: {
                args: /[_\-A-Za-z0-9]+/,
                msg: "The username may only contain characters in A-Z, 0-9, -, or _"
            }
        },
    },

    emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(val: string) {
            this.setDataValue('emailAddress', val.toLowerCase());
        },
        validate: {
            isEmail: {
                msg: "Please provide a valid email address"
            }
        }
    },

    hasValidatedAccount: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },

}, { sequelize, timestamps: true });

/**
 * @description The hash and salt used to check that the submitted password
 * matches the one that was originally submitted by the user.
 */
export class UserAuthenticationData extends Model {
    readonly id!: string;

    /** The salt used to check a submitted password. */
    passwordSalt!: number[];
    
    /** The hash computed when the password was first submitted. */
    passwordHash!: number[];
};

UserAuthenticationData.init({
    id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    passwordSalt: {
        type: DataTypes.ARRAY(DataTypes.NUMBER),
        allowNull: false,
    },

    passwordHash: {
        type: DataTypes.ARRAY(DataTypes.NUMBER),
        allowNull: false,
    },
}, { sequelize, timestamps: false });
User.hasOne(UserAuthenticationData);

/** Configurable user settings. */
export class UserPrefences extends Model {
    readonly id!: string;

    /** If set, cards created by users will be set to private by default. */
    cardsAreByDefaultPrivate!: boolean;

    /** The number of cards that the user aims to review per time period. */
    dailyTarget!: number;
};

UserPrefences.init({
    id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    cardsAreByDefaultPrivate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },

    dailyTarget: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 7,
        validate: {
            isPositive(val: number) {
                if (val <= 0) {
                    throw new Error("The daily target must be a positive number");
                }
            }
        }
    }
}, { sequelize, timestamps: false });
User.hasOne(UserPrefences);

/** 
 * A `UserAuthenticationToken` with this type allows a user to reset their 
 * password 
 */
export const PASSWORD_RESET_TOKEN_TYPE = "passwordReset";

/** 
 * A `UserAuthenticationToken` with this type allows a user to log into their
 * account without providing their password.
 */
export const SESSION_TOKEN_TYPE = "session";

/** 
 * A `UserAuthenticationToken` with this type allows a user to confirm that they
 * control the email address associated with the account.
 */
export const ACCOUNT_VALIDATION_TOKEN_TYPE = "accountValidation";

/**
 * @description The types of authentication tokens:
 * - `passwordReset` allows the user to reset their password
 * - `sessionToken` allows the app to login users w/o prompting for a password
 * - `accountValidation` allows the user to validate their account after signup
 */
const AUTH_TOKEN_TYPES = [
    PASSWORD_RESET_TOKEN_TYPE, SESSION_TOKEN_TYPE, ACCOUNT_VALIDATION_TOKEN_TYPE
];

/** Token used for authentication functionality in lieu of user password. */
export class UserAuthenticationToken extends Model {
    readonly id!: string;

    /** The type of token. The value is one of `AUTH_TOKEN_TYPES` */
    tokenType!: string;

    /** The value of the token. This value is automatically generated. */
    tokenValue!: string;

    getUser: BelongsToGetAssociationMixin<User>;
    setUser!: BelongsToSetAssociationMixin<User, User>;

    readonly createdAt!: Date;
    readonly updatedAt!: Date;
}

UserAuthenticationToken.init({
    id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    tokenType: {
        type: DataTypes.ENUM,
        values: AUTH_TOKEN_TYPES,
        allowNull: false
    },
    tokenValue: {
        type: DataTypes.STRING,
        unique: true
    }
}, { sequelize, timestamps: true});
UserAuthenticationToken.belongsTo(User);

/**
 * Populate the `tokenValue` field automatically. We defined this in a hook
 * instead of in a `defaultValue` so that we could generate a unique value.
 */
UserAuthenticationToken.beforeValidate(async (authToken) => {

    /** If the caller already set a token value, assume they know their stuff */
    if (authToken.tokenValue) return;

    /**
     * Why not use the inbuilt UUID function? Well, other than uniqueness, I
     * want security. UUIDs are not designed with an adversary in mind. For
     * instance, each char draws from (16 possible) hex values. We can do better
     * and pick  from `0-9a-zA-Z`. Furthermore, the UUID specs advise against
     * using them as security tokens[1]
     *  
     * [1]{@link https://tools.ietf.org/html/rfc4122#section-6}
     */
    function getUniqueTokenValue(): Promise<string> {
        let newTokenValue = getRandomString(256, ALPHANUMERICS);
        return new Promise(function(resolve, reject) {
            sequelize.models.userAuthenticationTokens
            .findOne({where: {tokenValue: newTokenValue}})
            .then(async (clashingToken: UserAuthenticationToken) => {
                if (clashingToken) {
                    resolve(await getUniqueTokenValue());
                } else {
                    resolve(newTokenValue);
                }
            })
            .catch((err: Error) => { reject(err); });
        });
        
    }

    try {
        authToken.tokenValue = await getUniqueTokenValue();
    } catch (err) {
        throw err;
    }
});

export class FlashCard extends Model {

    /** The ID of the card. */
    id: string;

    /** The title of the card, usually a summary of its description. */
    title: string;

    /** The contents of the card. This is where the question and answer are. */
    rawDescription: string;

    /** The `rawDescription` safely converted from markdown to HTML. */
    htmlDescription: string;

    /**
     * [Spaced Repetition]{@link https://en.wikipedia.org/wiki/Spaced_repetition} 
    * is commonly practised when a user has to retain a large amount of 
    * information indefinitely. It exploits the 
    * [Spacing Effect]{@link https://en.wikipedia.org/wiki/Spacing_effect}, the 
    * phenomenon whereby learning is greater when studying is spread out over time, 
    * as opposed to studying the same amount of content in a single session.
    * Flashcard software usually adjusts the spacing time based on whether the 
    * user provided the right answer. Answers may at times be too complex to 
    * define in code. We therefore depend on the user updating the `card.urgency` 
    * attribute in lieu of providing an answer to the flash card. Since the cards 
    * are shown in decreasing order of urgency, cards that are ranked lower will 
    * appear much later in subsequent review sessions.
     */
    urgency: number;

    /**
     * If `false`, then the card is private. A private flashcard is only visible 
     * to its owner. It will not appear in the public search results.
     *  
     * In contrast, a public card will appear in the search results as a 
     * read-only card. Any user that adds the card to their own collection will 
     * get a separate copy of the card.
     */
    isPublic: boolean;

    /**
     * If non-zero, then the user deleted this card at the time represented by
     * the timestamp (in ms since Unix). Trashed cards can be restored by the
     * user. The timestamp is stored so that stale cards can be permanently
     * deleted. 'Stale' == 30 days since the card was trashed.
     * 
     * If zero, then this card is active.
     */
    trashedTimestamp: number;

    /** 
     * The number of times this card has been marked as a duplicate. We try to 
     * keep the `browse` page free of duplicates. Users have an option of 
     * marking a card as duplicate so that duplicates don't all appear.
     */
    numTimesFlaggedAsDuplicate: number;

    /** 
     * 'Review' in this case means this card has questionable content, and 
     * shouldn't appear in the list of public cards. This is a number so that 
     * a moderator can first deal with the cards that have been flagged more.
     */
    numTimesFlaggedForReview: number;

    createdAt: Date;
    updatedAt: Date;

    /** 
     * The ID of the user who owns this card. Note that if the card was added
     * from the public cards, the owner might not be the original creator.
     */
    ownerId!: string;
    getOwner!: BelongsToGetAssociationMixin<User>;
    
    getChildren!: HasManyGetAssociationsMixin<FlashCard>;
    addChildren!: HasManyAddAssociationMixin<FlashCard, FlashCard>;
    getParent!: BelongsToGetAssociationMixin<FlashCard>;
    parentId: string;

    getTags!: HasManyGetAssociationsMixin<Tag>;
    setTags!: HasManySetAssociationsMixin<Tag, Tag[]>;
}

FlashCard.init({
    id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return this.getDataValue('title');
        },
        set(val) {
            this.setDataValue('title', val);
        }
    },

    rawDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    htmlDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    urgency: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            max: 10,
            min: 0
        }
    },

    isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    trashedTimestamp: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },

    numTimesFlaggedAsDuplicate: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },

    numTimesFlaggedForReview: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },

}, { sequelize, timestamps: true });

FlashCard.belongsTo(User, {as: "owner"});
FlashCard.hasMany(FlashCard, { as: "children" });
FlashCard.belongsTo(FlashCard, { as: "parent" });

export interface INewFlashCard extends Pick<
    FlashCard, "title" | "rawDescription" | "urgency" | "isPublic" > {
    tags: string[];
    htmlDescription?: string; // Purely for type-checking. Server controls this
    parentId?: string;
    ownerId: string;
};

/**
 * @description Represents a tag. The relationship between flashcards and tags
 * is `n:m`, i.e. a tag may appear in multiple flashcards and a flashcard may
 * have multiple tags.
 */
export class Tag extends Model {

    /** The tag's uuid */
    readonly id!: string;

    /** The tag's value, e.g. 'dynamic_programming' */
    value!: string;

    getFlashCards!: BelongsToManyGetAssociationsMixin<FlashCard>;
}

Tag.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },

    value: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, { sequelize, timestamps: false });

Tag.belongsToMany(FlashCard, { through: "FlashCardTag" });
FlashCard.belongsToMany(Tag, { through: "FlashCardTag" });

export class ReviewStreak extends Model {
    readonly id!: string;

    /** The last time when this review streak was reset to zero. */
    lastResetTimestamp!: number;

    /** 
     * The number of consecutive days for which the user has reviewed enough
     * cards to meet their daily target.
     */
    streakLength!: number;

    getFlashCards!: HasManyGetAssociationsMixin<FlashCard>;
    addFlashCards!: HasManyAddAssociationMixin<FlashCard, FlashCard[] | string[]>;
};

ReviewStreak.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },

    lastResetTimestamp: {
        type: DataTypes.NUMBER
    },

    streakLength: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

}, { sequelize, timestamps: false});

ReviewStreak.hasMany(FlashCard);
User.hasOne(ReviewStreak);

