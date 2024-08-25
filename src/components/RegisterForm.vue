<template>
    <CmdForm v-bind="cmdForm">
        <CmdHeadline headlineText="Find my soul-mate" headlineLevel="3" />
        <div class="flex-container">
            <CmdFormElement
                element="select"
                labelText="I am a"
                :displayLabelInline="true"
                :selectOptions="selectOptionsGender"
                v-model="genderA"
                :required="true"
            />
            <CmdFormElement
                element="select"
                labelText="searching for a"
                :displayLabelInline="true"
                :selectOptions="selectOptionsGender"
                v-model="genderB"
                :required="true"
            />
        </div>
        <div class="flex-container space-between" id="age-wrapper">
            <CmdFormElement
                element="input"
                type="number"
                labelText="from age"
                :displayLabelInline="true"
                v-model="ageFrom"
                maxlength="2"
                :required="true"
                placeholder="min. 18"
                @blur="setDefaultAges('from')"
            />
            <CmdFormElement
                element="input"
                type="number"
                labelText="to age"
                :displayLabelInline="true"
                v-model="ageTo"
                maxlength="2"
                :required="true"
                placeholder="max. 99"
                @blur="setDefaultAges('to')"
            />
        </div>
        <CmdFormElement
            element="input"
            type="text"
            labelText="in the region of"
            :displayLabelInline="true"
            :stretchField="true"
            placeholder="Enter region"
        />
    </CmdForm>
</template>

<script>
export default {
    name: "RegisterForm",
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