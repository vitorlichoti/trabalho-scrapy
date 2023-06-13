import requests
# raspar o P/L e VPA da ação, indicador de custo da ação: PL > 1 = caro, PL < 1 = barato
# comparação de PL com empresas do msm setor
# VPA < 1 = empresa vale menos que seu patrimônio líquido


def request_data_url(url_acao, headers) -> str:
    return requests.get(url_acao, headers=headers)


def helper_builder(content, css_class):
    return content.css(css_class)


def value_selector_builder(header_content) -> str:
    valor_atual_container = [
        "div.pb-3.pb-md-5",
        "div.top-info.has-special.d-flex.justify-between.flex-wrap",
        "div.info.special.w-100.w-md-33.w-lg-20",
        "div.d-md-inline-block",
        "div",
        "strong.value::text"
    ]

    minimo_maximo_container = [
        "div.pb-3.pb-md-5",
        "div.top-info.has-special.d-flex.justify-between.flex-wrap",
        "div.info.w-50.w-md-33.w-lg-20.border-md-0.border-lg-1",
        "div",
        "div",
        "strong.value::text"
    ]

    dividend_valorizacao_container = [
        "div.pb-3.pb-md-5",
        "div.top-info.has-special.d-flex.justify-between.flex-wrap",
        "div.info.w-50.w-md-50.w-lg-20",
        "div",
        "div",
        "strong.value::text"
    ]

    result = header_content
    for element in valor_atual_container:
        result = helper_builder(result, element)

    min_max = header_content
    for element in minimo_maximo_container:
        min_max = helper_builder(min_max, element)

    dividend_yield = header_content
    for element in dividend_valorizacao_container:
        dividend_yield = helper_builder(dividend_yield, element)

    return {
        "valor_atual": float(result.get().replace(',', '.')),
        "min": float(min_max[1].get().replace(',', '.')),
        "max": float(min_max[6].get().replace(',', '.')),
        "dividendo": dividend_yield[1].get().replace(',', '.'),
        "valorizacao": dividend_yield[6].get().replace(',', '.'),
    }


def header_content_builder(header_content):
    header_container = [
        "main#main-2",
        "div.container",
        "div.container",
        "div.paper"
    ]
    result = header_content
    for element in header_container:
        result = helper_builder(result, element)

    return result


def indicators_fundamentalists_container(header_content):
    indicators_container = [
        "div.pb-5.pt-5",
        "div.indicator-today-container",
        "div.d-flex.flex-wrap",
        "div.indicators.w-100",
        "div.d-flex.flex-wrap.align-items-center.justify-start",
        "div.w-50.w-sm-33.w-md-25.w-lg-16_6.mb-2.mt-2.item"
    ]

    indicators_value = []
    result = header_content
    for element in indicators_container:
        result = helper_builder(result, element)

    for item in result:
        item_value = item.css("div").css("div.d-flex.align-items-center.justify-between.pr-1.pr-xs-2").css("strong.value.d-block.lh-4.fs-4.fw-700::text").get()
        indicators_value.append(item_value)

    p_l = float(indicators_value[1].replace(',', '.'))
    p_vp = float(indicators_value[3].replace(',', '.'))
    vpa = float(indicators_value[8].replace(',', '.'))

    return {
        "pl": p_l,
        "vp": p_vp,
        "vpa": vpa,
    }


def contabil_info_container(header_content) -> any:
    contabil_container = [
        "main#main-2",
        "div#contabil-section",
        "div.container",
        "div.company.accounting",
        "div.scroll",
        "div.table-info-body",
        "table",
        "tbody",
        "tr"
    ]
    # linhas da tabela do demonstrativo contábil
    result = header_content
    for element in contabil_container:
        result = helper_builder(result, element)
