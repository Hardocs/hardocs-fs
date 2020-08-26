<template>
<div>
    <button :click:"suscribe" >Suscribe</button>

</div>
</template>

<script>
/*
 * ADVANCED FEATURE:
 * Given a template of yaml, or schema stored somewhere
 * When user clicks on new data
 * Then create an input text field with the template
 *
 * SIMPLEST FEATURE:
 * Given an input field
 * When user suscribes the field
 * Update data model of project (suscribe new object)
 */
export default{
props:{
    template: String, 
    required: false,
    default: "Part \n name: \n description: \n"
}
};
</script>
