using music.app as schema from '../../db/schema.cds';

annotate schema.Personalizations with {
    id          @title: '{i18n>id}';
    username    @title: '{i18n>username}';
    iconID      @title: '{i18n>iconID}';
    isActivated @title: '{i18n>isActivated}';
};
