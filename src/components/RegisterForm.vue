<template>
    <CmdForm v-bind="cmdForm">
        <CmdHeadline headlineText="Find my soul-mate" headlineLevel="3" />
        <div class="flex-container">
            <CmdFormElement
                element="select"
                :labelText="getMessage('register_form.labeltext.i_am_a')"
                :displayLabelInline="true"
                :selectOptions="selectOptionsGender"
                v-model="genderA"
                :required="true"
            />
            <CmdFormElement
                element="select"
                :labelText="getMessage('register_form.labeltext.searching_for_a')"
                :displayLabelInline="true"
                :selectOptions="selectOptionsGender"
                v-model="genderB"
                :required="true"
            />
        </div>
        <div class="flex-container" id="age-wrapper">
            <CmdFormElement
                element="input"
                type="number"
                :labelText="getMessage('register_form.labeltext.age_from')"
                :displayLabelInline="true"
                v-model="ageFrom"
                maxlength="2"
                :required="true"
                :placeholder="getMessage('register_form.placeholder.min_age')"
                @blur="setDefaultAges('from')"
            />
            <CmdFormElement
                element="input"
                type="number"
                :labelText="getMessage('register_form.labeltext.age_to')"
                :displayLabelInline="true"
                v-model="ageTo"
                maxlength="2"
                :required="true"
                :placeholder="getMessage('register_form.placeholder.max_age')"
                @blur="setDefaultAges('to')"
            />
        </div>
        <CmdFormElement
            element="input"
            type="text"
            :labelText="getMessage('register_form.labeltext.in_the_region_of')"
            :displayLabelInline="true"
            :stretchField="true"
            :placeholder="getMessage('register_form.placeholder.enter_region')"
        />
    </CmdForm>
</template>

<script>
import { I18n } from "comand-component-library"
import DefaultMessageProperties from "./mixins/RegisterForm/DefaultMessageProperties"
export default {
    name: "RegisterForm",
    mixins: [I18n, DefaultMessageProperties],
    data() {
        return {
            ageFrom: 25,
            ageTo: 35,
            genderA: "m",
            genderB: "f",
            selectOptionsGender: [
                {
                    text: "Male",
                    value: "m"
                },
                {
                    text: "Female",
                    value: "f"
                }
            ]
        }
    },
    props: {
        cmdForm: {
            type: Object,
            default() {
                return {
                    legend: {
                        show: false,
                        text: "Register and login"
                    },
                    submitButton: {
                        text: "Search for partners now",
                        position: "insideFieldset",
                        type: "button",
                        iconClass: "icon-check",
                        primary: true
                    }
                }
            }
        }
    },
    methods: {
        setDefaultAges(type) {
            console.log("type", type)
            console.log("this.ageFrom", this.ageFrom)
            console.log("this.ageTo", this.ageTo)
            // set legal age
            if(type === 'from' && Number(this.ageFrom) < 18) {
                this.ageFrom = "18"
            } else if (type === 'to' && Number(this.ageTo) < 18) {
                this.ageTo = "18"
            }
        }
    }
}
</script>

<style>

</style>