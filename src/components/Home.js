import React from "react";
import { inject, observer } from "mobx-react";
import View from "./View";


const Home = observer(({ store }) => {
    return (
        <View>

        </View>
    );
});

export default inject('store')(Home);